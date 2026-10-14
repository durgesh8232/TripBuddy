from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# --- Authentication Schemas ---

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

# --- Trip Planning Schemas ---

class TripRequest(BaseModel):
    user_id: Optional[int] = None
    destination: str
    travel_month: str = "October"
    duration_days: int = Field(default=3, ge=1, le=14)
    budget_tier: str = "Moderate (3-Star + Good Cafes)"
    vibe: str = "Food & Culture"
    dietary_preference: str = "Any"
    
    # Advanced filter additions
    pacing: str = "Balanced"                     # Relaxed, Balanced, Fast-Paced
    travel_group: str = "Solo"                   # Solo, Couple, Friends, Family
    transport_pref: str = "Public & Auto"        # Public & Auto, Self-Drive Rental, Private Cab

# --- Travel Assistant Schemas ---

class ChatRequest(BaseModel):
    message: str
    destination: str
    context: str = ""

# --- Activity Swap Schema ---

class SwapActivityRequest(BaseModel):
    destination: str
    travel_month: str = "October"
    budget_tier: str = "Moderate (3-Star + Good Cafes)"
    vibe: str = "Food & Culture"
    time_of_day: str
    current_activity_title: str
    avoid_titles: List[str] = Field(default_factory=list)

class ReviewCreateRequest(BaseModel):
    user_id: int
    user_name: str
    destination: str
    spot_name: Optional[str] = "Overall Destination"
    rating: int = Field(ge=1, le=5)
    comment: str

class ReviewResponse(BaseModel):
    id: int
    user_name: str
    destination: str
    spot_name: str
    rating: int
    comment: str
    created_at: str