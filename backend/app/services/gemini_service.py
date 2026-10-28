import os
import json
import random
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from openai import OpenAI
from app.schemas.trip_schema import TripPlan, ActivityItem
from app.schemas.request_schema import TripRequest, SwapActivityRequest
from app.services.image_service import get_real_image

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY", "").strip()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
    default_headers={
        "HTTP-Referer": "https://trip-buddy-peach.vercel.app",
        "X-Title": "TripBuddy",
    },
)

# OpenRouter Free Tier endpoints to avoid 429 Insufficient Credits / Quota errors
MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-2-9b-it:free",
    "meta-llama/llama-3.1-8b-instruct:free",
]

# Destination baseline coordinates for automatic geographical anchoring
CITY_COORDINATES = {
    "varanasi": (25.3176, 82.9739),
    "goa": (15.2993, 74.1240),
    "mumbai": (19.0760, 72.8777),
    "delhi": (28.6139, 77.2090),
    "new delhi": (28.6139, 77.2090),
    "jaipur": (26.9124, 75.7873),
    "manali": (32.2432, 77.1892),
    "kerala": (9.9312, 76.2673),
    "udaipur": (24.5854, 73.7125),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "hyderabad": (17.3850, 78.4867),
    "chennai": (13.0827, 80.2707),
    "kolkata": (22.5726, 88.3639),
    "agra": (27.1767, 78.0081),
    "amritsar": (31.6340, 74.8723),
    "rishikesh": (30.0869, 78.2676),
    "pune": (18.5204, 73.8567),
    "nashik": (19.9975, 73.7898),
}


def sanitize_coordinates(plan: TripPlan, destination: str) -> TripPlan:
    """Ensures all itinerary activity coordinates fall strictly within the destination region."""
    dest_clean = destination.strip().lower()
    default_lat, default_lng = None, None

    for city_key, coords in CITY_COORDINATES.items():
        if city_key in dest_clean:
            default_lat, default_lng = coords
            break

    if default_lat is None:
        for day in plan.itinerary:
            for act in day.activities:
                if act.latitude and act.longitude and not (round(act.latitude, 1) == 20.0 and round(act.longitude, 1) == 73.8):
                    default_lat, default_lng = act.latitude, act.longitude
                    break
            if default_lat is not None:
                break

    if default_lat is None:
        default_lat, default_lng = 20.5937, 78.9629  # India center

    for day in plan.itinerary:
        for act in day.activities:
            is_dummy = (
                act.latitude is None
                or act.longitude is None
                or act.latitude == 0.0
                or act.longitude == 0.0
                or (round(act.latitude, 1) == 20.0 and round(act.longitude, 1) == 73.8 and "nashik" not in dest_clean)
            )
            if is_dummy:
                act.latitude = round(default_lat + random.uniform(-0.03, 0.03), 4)
                act.longitude = round(default_lng + random.uniform(-0.03, 0.03), 4)

    return plan


def enrich_trip_images(plan: TripPlan) -> TripPlan:
    """Fetches destination hero, stays, and activities photography concurrently to eliminate latency."""
    tasks = []

    def set_hero():
        plan.hero_image_url = get_real_image(
            place_name=plan.destination,
            destination=plan.destination,
            category="hero",
        )

    tasks.append(set_hero)

    for day in plan.itinerary:
        if hasattr(day, "recommended_stays") and day.recommended_stays:
            for hotel in day.recommended_stays:
                def set_hotel(h=hotel):
                    h.image_url = get_real_image(
                        place_name=h.name,
                        destination=plan.destination,
                        category="stay",
                    )
                tasks.append(set_hotel)
        elif hasattr(day, "stay") and day.stay:
            def set_single_stay(s=day.stay):
                s.image_url = get_real_image(
                    place_name=s.name,
                    destination=plan.destination,
                    category="stay",
                )
            tasks.append(set_single_stay)

        for act in day.activities:
            def set_activity(a=act):
                a.image_url = get_real_image(
                    place_name=a.title,
                    destination=plan.destination,
                    category="activity",
                )
            tasks.append(set_activity)

    with ThreadPoolExecutor(max_workers=10) as executor:
        list(executor.map(lambda fn: fn(), tasks))

    return plan


def enforce_pacing_bounds(plan: TripPlan, destination: str, pacing: str) -> TripPlan:
    """Guarantees every day has minimum 2 and maximum 5 activities, strictly tailored to pacing."""
    target_min = 4 if pacing == "Fast-Paced" else (3 if pacing == "Balanced" else 2)

    for day in plan.itinerary:
        if len(day.activities) > 5:
            day.activities = day.activities[:5]

        time_slots = ["Morning", "Afternoon", "Evening", "Night"]

        while len(day.activities) < target_min and len(day.activities) < 5:
            slot = time_slots[len(day.activities) % len(time_slots)]
            spot_title = f"Local Heritage & Cultural Exploration in {destination}"
            fallback_item = ActivityItem(
                time_of_day=slot,
                title=spot_title,
                description=f"Explore prominent cultural landmarks, street bazaars, and heritage in {destination}.",
                estimated_cost_inr="₹200",
                transit_tip="Walking / Quick Auto",
                latitude=0.0,
                longitude=0.0,
                image_url=get_real_image(spot_title, destination, category="activity"),
            )
            day.activities.append(fallback_item)

        while len(day.activities) < 2:
            spot_title = f"Scenic Viewpoint & Sunset in {destination}"
            day.activities.append(
                ActivityItem(
                    time_of_day="Evening",
                    title=spot_title,
                    description=f"Relax at a well-known local scenic viewpoint during golden hour in {destination}.",
                    estimated_cost_inr="₹100",
                    transit_tip="Auto / Taxi",
                    latitude=0.0,
                    longitude=0.0,
                    image_url=get_real_image(spot_title, destination, category="activity"),
                )
            )

    return plan


def generate_trip_itinerary(request: TripRequest) -> TripPlan:
    prompt = f"""
    Generate a complete travel plan in JSON for:
    - Destination: {request.destination}
    - Month: {request.travel_month}
    - Duration: {request.duration_days} days
    - Budget Tier: {request.budget_tier}
    - Vibe: {request.vibe}
    - Dietary Preference: {request.dietary_preference}
    - Pacing: {request.pacing}
    - Group Type: {request.travel_group}
    - Transport Preference: {request.transport_pref}

    CRITICAL DURATION MANDATE:
    - The "itinerary" array MUST contain EXACTLY {request.duration_days} separate day objects (Day 1 through Day {request.duration_days}).
    - You must NOT generate fewer days than requested.

    COORDINATE & MAP ACCURACY:
    - Provide realistic, accurate latitude and longitude floating-point values strictly within or immediate to {request.destination}.
    - Do NOT provide dummy values or placeholder coordinates.

    STAYS & FOOD REQUIREMENTS:
    - For each day, provide 2 "recommended_stays" matching different budgets (Budget, Luxury).
    - For each day, provide 2 "recommended_food" spots with signature dishes aligned to {request.dietary_preference}.
    - Keep all activity descriptions to 1 concise sentence.

    Strict JSON Schema required:
    {{
      "destination": "{request.destination}",
      "hero_image_url": "",
      "recommended_month_note": "Short weather note for {request.travel_month}",
      "total_estimated_budget_inr": "₹...",
      "budget_breakdown_inr": {{"stays": "₹...", "food": "₹...", "travel": "₹...", "activities": "₹..."}},
      "practical_travel_tips": ["tip1", "tip2"],
      "packing_checklist": [{{"category_name": "Clothing", "items": ["item1", "item2"]}}],
      "itinerary": [
        {{
          "day": 1,
          "day_theme": "Theme title",
          "recommended_stays": [
            {{
              "name": "Hotel Option",
              "area": "Locality",
              "price_per_night_inr": "₹800 / night",
              "category": "Backpacker / Budget",
              "why_pick_here": "Clean amenities near transport links.",
              "image_url": ""
            }}
          ],
          "stay": {{
            "name": "Primary Hotel Pick",
            "area": "Locality",
            "price_per_night_inr": "₹...",
            "best_for": "Reason",
            "image_url": ""
          }},
          "recommended_food": [
            {{
              "name": "Restaurant Name",
              "cuisine_type": "Local Authentic",
              "must_try_dish": "Signature dish",
              "approx_cost_for_two_inr": "₹300",
              "area": "Locality"
            }}
          ],
          "activities": [
            {{
              "time_of_day": "Morning",
              "title": "Spot Name",
              "description": "Short 1-line description.",
              "estimated_cost_inr": "₹...",
              "transit_tip": "Transit via {request.transport_pref}",
              "latitude": 25.3176,
              "longitude": 82.9739,
              "image_url": ""
            }}
          ]
        }}
      ]
    }}
    Rules:
    1. All currency strictly in ₹ INR. Never use dollars ($).
    2. Output strictly valid JSON only. Do not add markdown fences or conversational preambles.
    """

    last_error = None

    for model_name in MODELS:
        try:
            print(f"[TripBuddy] Generating {request.duration_days}-day itinerary via {model_name}...")
            completion = client.chat.completions.create(
                model=model_name,
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": "You are TripBuddy, an expert Indian travel AI. All pricing must be strictly in Indian Rupees (₹ INR). You output strict valid JSON only.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                max_tokens=4500,
            )
            raw_content = completion.choices[0].message.content
            parsed_plan = TripPlan.model_validate_json(raw_content)

            # 1. Enforce activity bounds
            bounded_plan = enforce_pacing_bounds(parsed_plan, request.destination, request.pacing)
            # 2. Sanitize and cluster map coordinates inside the destination
            sanitized_plan = sanitize_coordinates(bounded_plan, request.destination)
            # 3. Enrich imagery in parallel
            return enrich_trip_images(sanitized_plan)
        except Exception as e:
            last_error = e
            print(f"[Warning] Model {model_name} failed: {e}")
            continue

    raise last_error


def swap_single_activity(req: SwapActivityRequest) -> ActivityItem:
    """Quickly generate a single replacement activity matching the slot with an Unsplash photo."""
    avoid_list = ", ".join(req.avoid_titles) if req.avoid_titles else req.current_activity_title
    prompt = f"""
    Suggest ONE alternative travel activity to replace '{req.current_activity_title}' in {req.destination}.
    - Time of day: {req.time_of_day}
    - Budget tier: {req.budget_tier}
    - Travel Vibe: {req.vibe}
    - Month: {req.travel_month}
    - Avoid these places already in the plan: {avoid_list}

    Return strict JSON matching this exact structure:
    {{
      "time_of_day": "{req.time_of_day}",
      "title": "New Spot Name",
      "description": "Short 1-line description of what to do here.",
      "estimated_cost_inr": "₹200",
      "transit_tip": "Quick auto / cab route tip",
      "latitude": 0.0,
      "longitude": 0.0,
      "image_url": ""
    }}
    Rules: Currency strictly in ₹ INR. Return valid raw JSON only. Provide accurate coordinates for {req.destination}.
    """

    for model_name in MODELS:
        try:
            completion = client.chat.completions.create(
                model=model_name,
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": "You are TripBuddy. Output strict JSON only for a single travel activity in ₹ INR.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
                max_tokens=400,
            )
            raw = completion.choices[0].message.content
            item = ActivityItem.model_validate_json(raw)

            if item.latitude == 0.0 or item.longitude == 0.0:
                for city_key, coords in CITY_COORDINATES.items():
                    if city_key in req.destination.strip().lower():
                        item.latitude = round(coords[0] + random.uniform(-0.02, 0.02), 4)
                        item.longitude = round(coords[1] + random.uniform(-0.02, 0.02), 4)
                        break

            item.image_url = get_real_image(item.title, req.destination, category="activity")
            return item
        except Exception as e:
            print(f"[Swap Warning] {model_name} failed: {e}")
            continue

    raise RuntimeError("Unable to swap activity right now. Please try again.")


def answer_travel_chat(message: str, destination: str, context: str) -> str:
    prompt = f"Destination: {destination}\nUser Question: {message}\nContext: {context}\nGive a fast, 2-line response with prices in ₹ INR."

    for model_name in MODELS:
        try:
            completion = client.chat.completions.create(
                model=model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are TripBuddy live assistant. Keep answers brief (max 2-3 sentences) with ₹ INR pricing.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=150,
            )
            return completion.choices[0].message.content
        except Exception:
            continue

    return "Live assistant is busy. Please ask again in a moment!"