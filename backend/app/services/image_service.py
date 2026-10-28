import os
import re
import urllib.parse
import threading
import requests
from dotenv import load_dotenv

load_dotenv()

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "").strip()

# Global in-memory cache with lock for concurrent safety
IMAGE_CACHE: dict[str, str] = {}
_cache_lock = threading.Lock()

# Reusable HTTP Session with connection pooling
session = requests.Session()
adapter = requests.adapters.HTTPAdapter(pool_connections=20, pool_maxsize=20)
session.mount("https://", adapter)
session.mount("http://", adapter)

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
    """Strips conversational noise words to produce search-friendly landmark names."""
    cleaned = re.sub(
        r"^(visit|explore|walk through|head to|discover|experience|enjoy a|enjoy|trip to|tour of|trek to|take a walk at|go to|spend time at)\s+(the\s+)?",
        "",
        text,
        flags=re.IGNORECASE,
    )
    cleaned = re.sub(r"[^\w\s]", " ", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def fetch_from_wikipedia(query: str) -> str | None:
    """Searches Wikipedia using the OpenSearch/Query API with a tight 1.2-second timeout."""
    headers = {"User-Agent": "TripBuddy/2.0 (travel-planner-app)"}
    try:
        search_url = (
            f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}"
            f"&format=json&utf8=1&srlimit=1"
        )
        s_res = session.get(search_url, headers=headers, timeout=1.2)
        if s_res.status_code != 200:
            return None

        search_data = s_res.json()
        search_results = search_data.get("query", {}).get("search", [])
        if not search_results:
            return None

        best_title = search_results[0]["title"]

        page_url = (
            f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(best_title)}"
            f"&prop=pageimages&format=json&pithumbsize=800"
        )
        p_res = session.get(page_url, headers=headers, timeout=1.2)
        if p_res.status_code == 200:
            pages = p_res.json().get("query", {}).get("pages", {})
            for _, val in pages.items():
                if "thumbnail" in val and "source" in val["thumbnail"]:
                    return val["thumbnail"]["source"]
    except Exception:
        pass

    return None


def search_unsplash_photo(query: str) -> str | None:
    """Queries Unsplash Search API with a fast 1.5-second timeout."""
    if not UNSPLASH_ACCESS_KEY:
        return None

    try:
        encoded_query = urllib.parse.quote(query)
        url = f"https://api.unsplash.com/search/photos?query={encoded_query}&per_page=1&orientation=landscape"
        headers = {
            "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}",
            "Accept-Version": "v1",
        }
        res = session.get(url, headers=headers, timeout=1.5)
        if res.status_code == 200:
            results = res.json().get("results", [])
            if results:
                urls = results[0]["urls"]
                return urls.get("regular") or urls.get("small")
    except Exception:
        pass

    return None


def get_real_image(place_name: str, destination: str = "", category: str = "activity") -> str:
    """
    Finds real photos concurrently using thread-safe caching:
    1. Cache hit check
    2. Wikipedia search (targeted)
    3. Unsplash search
    4. Category fallback
    """
    cleaned_name = clean_place_name(place_name)
    cache_key = f"{cleaned_name.lower()}_{destination.lower()}"

    with _cache_lock:
        if cache_key in IMAGE_CACHE:
            return IMAGE_CACHE[cache_key]

    target_query = f"{cleaned_name} {destination}".strip() if destination else cleaned_name

    # 1. First Priority: Wikipedia Search
    wiki_url = fetch_from_wikipedia(target_query)
    if wiki_url:
        with _cache_lock:
            IMAGE_CACHE[cache_key] = wiki_url
        return wiki_url

    # 2. Second Priority: Unsplash Search
    photo_url = search_unsplash_photo(target_query)
    if photo_url:
        with _cache_lock:
            IMAGE_CACHE[cache_key] = photo_url
        return photo_url

    # 3. Third Priority: Fallbacks
    if category == "hero":
        fallback = FALLBACK_HERO
    elif category == "stay":
        fallback = FALLBACK_STAY
    else:
        idx = abs(hash(cleaned_name)) % len(FALLBACK_ACTIVITIES)
        fallback = FALLBACK_ACTIVITIES[idx]

    with _cache_lock:
        IMAGE_CACHE[cache_key] = fallback
    return fallback