from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ActivityItem(BaseModel):
    time_of_day: str
    title: str
    description: str
    estimated_cost_inr: str
    transit_tip: str
    latitude: Optional[float] = 20.0
    longitude: Optional[float] = 73.78
    image_url: Optional[str] = ""

class StayItem(BaseModel):
    name: str
    area: Optional[str] = "City Center"
    price_per_night_inr: Optional[str] = "₹1,500 / night"
    category: Optional[str] = "Comfort Stay"
    why_pick_here: Optional[str] = "Centrally located and clean."
    best_for: Optional[str] = None
    image_url: Optional[str] = ""

class FoodItem(BaseModel):
    name: str
    cuisine_type: Optional[str] = "Local Specialties"
    dietary_type: Optional[str] = "Vegetarian"
    must_try_dish: Optional[str] = "Regional Thali"
    approx_cost_for_two_inr: Optional[str] = "₹300"
    area: Optional[str] = "Local Market"

class DayPlan(BaseModel):
    day: int
    day_theme: str
    # Supports both new multi-item arrays and legacy single stay object
    recommended_stays: Optional[List[StayItem]] = []
    stay: Optional[StayItem] = None
    recommended_food: Optional[List[FoodItem]] = []
    food: Optional[FoodItem] = None
    activities: List[ActivityItem]

class PackingCategory(BaseModel):
    category_name: str
    items: List[str]

class TripPlan(BaseModel):
    destination: str
    hero_image_url: Optional[str] = ""
    recommended_month_note: Optional[str] = ""
    total_estimated_budget_inr: Optional[str] = ""
    budget_breakdown_inr: Optional[Dict[str, str]] = {}
    practical_travel_tips: Optional[List[str]] = []
    packing_checklist: Optional[List[PackingCategory]] = []
    itinerary: List[DayPlan]