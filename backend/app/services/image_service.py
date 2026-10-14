import os
import re
import urllib.parse
import requests
from dotenv import load_dotenv

load_dotenv()

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "").strip()

IMAGE_CACHE: dict[str, str] = {}

# Diverse backup photography if all APIs fail
FALLBACK_HERO = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
FALLBACK_STAY = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"

FALLBACK_ACTIVITIES = [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",  # Mountain/Nature
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",  # Indian Temple
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80",  # Heritage / Fort
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",  # Lake/Dam
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",  # Beach/Coast
]


def clean_place_name(text: str) -> str:
    """
    Strips noise words like 'Visit the', 'Walk through', 'Enjoy a sunset at', etc.
    Turns 'Visit the Panchavati Temple' -> 'Panchavati Temple'
    """
    # Remove leading common AI activity phrases
    cleaned = re.sub(
        r"^(visit|explore|walk through|head to|discover|experience|enjoy a|enjoy|trip to|tour of|trek to|take a walk at|go to|spend time at)\s+(the\s+)?",
        "",
        text,
        flags=re.IGNORECASE,
    )
    # Remove unwanted punctuation
    cleaned = re.sub(r"[^\w\s]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def fetch_from_wikipedia(query: str) -> str | None:
    """
    Searches Wikipedia using the OpenSearch/Query API so landmark names
    like 'Panchavati' or 'Gangapur Dam' find their exact page and authentic photo.
    """
    headers = {"User-Agent": "TripBuddy/2.0 (travel-planner-app)"}
    try:
        # Step 1: Search Wikipedia for the best matching page title
        search_url = (
            f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}"
            f"&format=json&utf8=1&srlimit=1"
        )
        s_res = requests.get(search_url, headers=headers, timeout=3.0)
        if s_res.status_code != 200:
            return None
        search_data = s_res.json()
        search_results = search_data.get("query", {}).get("search", [])
        if not search_results:
            return None

        best_title = search_results[0]["title"]

        # Step 2: Grab the official thumbnail / original image of that page
        page_url = (
            f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(best_title)}"
            f"&prop=pageimages&format=json&pithumbsize=800"
        )
        p_res = requests.get(page_url, headers=headers, timeout=3.0)
        if p_res.status_code == 200:
            pages = p_res.json().get("query", {}).get("pages", {})
            for _, val in pages.items():
                if "thumbnail" in val and "source" in val["thumbnail"]:
                    return val["thumbnail"]["source"]
    except Exception as e:
        print(f"[Wikipedia Error] {e}")

    return None


def search_unsplash_photo(query: str) -> str | None:
    """Queries Unsplash Search API with authorization."""
    if not UNSPLASH_ACCESS_KEY:
        return None

    try:
        encoded_query = urllib.parse.quote(query)
        url = f"https://api.unsplash.com/search/photos?query={encoded_query}&per_page=1&orientation=landscape"
        headers = {
            "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}",
            "Accept-Version": "v1",
        }
        res = requests.get(url, headers=headers, timeout=3.5)
        if res.status_code == 200:
            results = res.json().get("results", [])
            if results:
                urls = results[0]["urls"]
                return urls.get("regular") or urls.get("small")
        elif res.status_code == 403:
            print("[Unsplash] 403 Forbidden / Rate limit reached. Using Wikipedia fallback.")
    except Exception as e:
        print(f"[Unsplash Warning] {e}")

    return None


def get_real_image(place_name: str, destination: str = "", category: str = "activity") -> str:
    """
    Finds real photos by cleaning the spot name and querying:
    1. Wikipedia (most accurate for monuments, temples, dams, and forts)
    2. Unsplash API
    3. Category Fallback
    """
    cleaned_name = clean_place_name(place_name)
    cache_key = f"{cleaned_name.lower()}_{destination.lower()}"

    if cache_key in IMAGE_CACHE:
        return IMAGE_CACHE[cache_key]

    # 1. First Priority: Wikipedia Search (Finds exact Panchavati, Gangapur Dam, Trimbakeshwar, etc.)
    wiki_queries = [
        f"{cleaned_name} {destination}".strip(),
        cleaned_name,
    ]
    for q in wiki_queries:
        wiki_url = fetch_from_wikipedia(q)
        if wiki_url:
            IMAGE_CACHE[cache_key] = wiki_url
            return wiki_url

    # 2. Second Priority: Unsplash Search
    unsplash_queries = [
        f"{cleaned_name} {destination}".strip(),
        cleaned_name,
        f"{destination} {category}".strip(),
    ]
    for q in unsplash_queries:
        photo_url = search_unsplash_photo(q)
        if photo_url:
            IMAGE_CACHE[cache_key] = photo_url
            return photo_url

    # 3. Third Priority: Context-matched fallback
    if category == "hero":
        fallback = FALLBACK_HERO
    elif category == "stay":
        fallback = FALLBACK_STAY
    else:
        # Distribute different fallback images across activities so they never all look identical
        idx = abs(hash(cleaned_name)) % len(FALLBACK_ACTIVITIES)
        fallback = FALLBACK_ACTIVITIES[idx]

    IMAGE_CACHE[cache_key] = fallback
    return fallback