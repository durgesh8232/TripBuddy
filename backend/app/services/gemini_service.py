import os
import json
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
)

# High-throughput, low-latency models for rapid JSON output
MODELS = [
    "google/gemini-2.0-flash-001",
    "google/gemini-2.0-flash-lite-001",
    "meta-llama/llama-3.1-8b-instruct",
    "mistralai/mistral-small-24b-instruct-2501",
]


def enrich_trip_images(plan: TripPlan) -> TripPlan:
    """Fetches destination hero, stays, and activities photography concurrently to eliminate latency."""
    tasks = []

    # 1. Main Hero Destination Image
    def set_hero():
        plan.hero_image_url = get_real_image(
            place_name=plan.destination,
            destination=plan.destination,
            category="hero",
        )

    tasks.append(set_hero)

    # 2. Daily Hotel & Activity Spots (queued in parallel)
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

    # Execute all 15-25 image lookups simultaneously
    with ThreadPoolExecutor(max_workers=10) as executor:
        list(executor.map(lambda fn: fn(), tasks))

    return plan


def enforce_pacing_bounds(plan: TripPlan, destination: str, pacing: str) -> TripPlan:
    """Guarantees every day has minimum 2 and maximum 5 activities, strictly tailored to pacing."""
    target_min = 4 if pacing == "Fast-Paced" else (3 if pacing == "Balanced" else 2)

    for day in plan.itinerary:
        # Enforce maximum 5 places across all pacing modes
        if len(day.activities) > 5:
            day.activities = day.activities[:5]

        # Enforce minimum activity requirements
        time_slots = ["Morning", "Afternoon", "Evening", "Night"]

        while len(day.activities) < target_min and len(day.activities) < 5:
            slot = time_slots[len(day.activities) % len(time_slots)]
            spot_title = f"Local Heritage Walk & Markets in {destination}"
            fallback_item = ActivityItem(
                time_of_day=slot,
                title=spot_title,
                description=f"Explore vibrant local bazaars and architectural sights in {destination}.",
                estimated_cost_inr="₹150",
                transit_tip="Walking / Quick Auto",
                latitude=20.0,
                longitude=73.78,
                image_url=get_real_image(spot_title, destination, category="activity"),
            )
            day.activities.append(fallback_item)

        # Global absolute safety floor: minimum 2 places always
        while len(day.activities) < 2:
            spot_title = f"Sunset Viewpoint in {destination}"
            day.activities.append(
                ActivityItem(
                    time_of_day="Evening",
                    title=spot_title,
                    description="Relax at a popular scenic viewpoint during golden hour.",
                    estimated_cost_inr="₹100",
                    transit_tip="Auto / Taxi",
                    latitude=20.0,
                    longitude=73.78,
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

    STRICT PACING AND ACTIVITY COUNT PER DAY:
    - If pacing is "Fast-Paced": Each day MUST have exactly 4 or 5 activities (minimum 4, maximum 5).
    - If pacing is "Relaxed": Each day MUST have 2 or 3 activities (minimum 2, maximum 3).
    - If pacing is "Balanced": Each day MUST have 3 or 4 activities.
    - ABSOLUTE BOUNDS: Under NO circumstance should any day have fewer than 2 or more than 5 activities.

    STAYS & FOOD OPTIONS REQUIREMENTS:
    - Provide exactly 3 to 4 varied "recommended_stays" per day covering different budgets:
      1. Backpacker / Hostel or Budget lodge
      2. Mid-range comfortable boutique hotel
      3. Heritage / Resort / Premium stay
      Include real locality/area and a concise 'why_pick_here' reason.
    - Provide exactly 3 to 4 iconic "recommended_food" spots per day:
      Include popular local restaurants, iconic street breakfast joints, or authentic thali messes with specific 'must_try_dish' items aligned with the dietary preference ({request.dietary_preference}).

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
              "name": "Hotel Option 1",
              "area": "Locality/Neighborhood",
              "price_per_night_inr": "₹800 / night",
              "category": "Backpacker / Budget",
              "why_pick_here": "Walkable to bus stand, clean dorms and lockers.",
              "image_url": ""
            }},
            {{
              "name": "Hotel Option 2",
              "area": "Locality/Neighborhood",
              "price_per_night_inr": "₹2,500 / night",
              "category": "Mid-Range Boutique",
              "why_pick_here": "Comfortable family suites with complimentary breakfast.",
              "image_url": ""
            }},
            {{
              "name": "Hotel Option 3",
              "area": "Locality/Neighborhood",
              "price_per_night_inr": "₹5,500 / night",
              "category": "Heritage / Luxury Resort",
              "why_pick_here": "Scenic views, pool, and upscale dining.",
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
              "name": "Restaurant / Food Joint 1",
              "cuisine_type": "Local Authentic",
              "must_try_dish": "Signature dish name",
              "approx_cost_for_two_inr": "₹250",
              "area": "Locality"
            }},
            {{
              "name": "Restaurant / Food Joint 2",
              "cuisine_type": "Heritage Eatery",
              "must_try_dish": "Special snack or thali",
              "approx_cost_for_two_inr": "₹400",
              "area": "Locality"
            }},
            {{
              "name": "Restaurant / Food Joint 3",
              "cuisine_type": "Street Food Hub",
              "must_try_dish": "Popular local delicacy",
              "approx_cost_for_two_inr": "₹150",
              "area": "Locality"
            }}
          ],
          "activities": [
            {{
              "time_of_day": "Morning",
              "title": "Spot Name",
              "description": "Short 1-line description tailored to {request.pacing} pacing.",
              "estimated_cost_inr": "₹...",
              "transit_tip": "Transit via {request.transport_pref}",
              "latitude": 20.0,
              "longitude": 73.78,
              "image_url": ""
            }}
          ]
        }}
      ]
    }}
    Rules:
    1. All currency strictly in ₹ INR. Never use dollars ($).
    2. Respect travel group ({request.travel_group}) and pacing ({request.pacing}).
    3. Ensure exactly 3 to 4 stays and 3 to 4 food options are provided per day.
    4. Keep activity descriptions to 1 concise sentence.
    5. Return ONLY valid raw JSON without conversational markdown or filler.
    """

    last_error = None

    for model_name in MODELS:
        try:
            print(f"[TripBuddy] Generating itinerary via OpenRouter ({model_name})...")
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
                max_tokens=3500,
            )
            raw_content = completion.choices[0].message.content
            parsed_plan = TripPlan.model_validate_json(raw_content)

            # Apply pacing bounds and fetch images concurrently
            bounded_plan = enforce_pacing_bounds(parsed_plan, request.destination, request.pacing)
            return enrich_trip_images(bounded_plan)
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
      "latitude": 20.0,
      "longitude": 73.78,
      "image_url": ""
    }}
    Rules: Currency strictly in ₹ INR. Return valid raw JSON only.
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