from pydantic import BaseModel
from typing import List, Dict, Optional


class ActivityItem(BaseModel):
    time_of_day: str
    title: str
    description: str
    estimated_cost_inr: str
    transit_tip: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None


class StayRecommendation(BaseModel):
    name: str
    area: str
    price_per_night_inr: str
    best_for: str
    image_url: Optional[str] = None


class FoodRecommendation(BaseModel):
    name: str
    cuisine_type: str
    must_try_dish: str
    approx_cost_for_two_inr: str


class DayPlan(BaseModel):
    day: int
    day_theme: str
    stay: StayRecommendation
    recommended_food: List[FoodRecommendation]
    activities: List[ActivityItem]


class PackingCategory(BaseModel):
    category_name: str
    items: List[str]


class TripPlan(BaseModel):
    destination: str
    hero_image_url: Optional[str] = None
    recommended_month_note: str
    total_estimated_budget_inr: str
    budget_breakdown_inr: Dict[str, str]
    practical_travel_tips: List[str]
    packing_checklist: List[PackingCategory]
    itinerary: List[DayPlan]