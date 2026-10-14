import json
import traceback
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import get_db
from app.schemas.request_schema import TripRequest, SwapActivityRequest, ReviewCreateRequest
from app.schemas.trip_schema import TripPlan, ActivityItem
from app.services.gemini_service import generate_trip_itinerary, swap_single_activity

router = APIRouter(prefix="/api", tags=["Trips"])

@router.post("/plan-trip", response_model=TripPlan)
def plan_and_save_trip(request: TripRequest, db: Session = Depends(get_db)):
    try:
        plan = generate_trip_itinerary(request)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

    try:
        query = text("""
            INSERT INTO trips (user_id, destination, travel_month, duration_days, budget_tier, vibe, dietary_preference, trip_data)
            VALUES (:uid, :dest, :month, :dur, :budget, :vibe, :diet, :data)
        """)
        db.execute(query, {
            "uid": request.user_id,
            "dest": request.destination,
            "month": request.travel_month,
            "dur": request.duration_days,
            "budget": request.budget_tier,
            "vibe": request.vibe,
            "diet": request.dietary_preference,
            "data": plan.model_dump_json()
        })
        db.commit()
        return plan
    except Exception as e:
        db.rollback()
        print(f"MySQL Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    
# this api logic is for swap activity in a trip plan. It takes a SwapActivityRequest, 
# calls the swap_single_activity service, and returns the new activity. 
# If any error occurs, it raises an HTTPException with a 500 status code and the error message.

@router.post("/swap-activity", response_model=ActivityItem)
def swap_activity_endpoint(request: SwapActivityRequest):
    try:
        new_activity = swap_single_activity(request)
        return new_activity
    except Exception as e:
        print(f"Swap Activity Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Swap Error: {str(e)}")

@router.get("/my-trips/{user_id}")
def get_user_trips(user_id: int, db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT id, destination, travel_month, duration_days, trip_data, created_at 
            FROM trips 
            WHERE user_id = :uid 
            ORDER BY created_at DESC
        """)
        results = db.execute(query, {"uid": user_id}).fetchall()
        trips = []
        for r in results:
            trips.append({
                "id": r[0],
                "destination": r[1],
                "travel_month": r[2],
                "duration_days": r[3],
                "trip_data": json.loads(r[4]) if isinstance(r[4], str) else r[4],
                "created_at": str(r[5])
            })
        return trips
    except Exception as e:
        print(f"MySQL Fetch Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@router.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    try:
        db.execute(text("DELETE FROM trips WHERE id = :tid"), {"tid": trip_id})
        db.commit()
        return {"message": "Trip deleted successfully"}
    except Exception as e:
        db.rollback()
        print(f"MySQL Delete Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

# --- Reviews & Ratings Endpoints ---

@router.post("/reviews")
def add_review(req: ReviewCreateRequest, db: Session = Depends(get_db)):
    try:
        query = text("""
            INSERT INTO reviews (user_id, user_name, destination, spot_name, rating, comment)
            VALUES (:uid, :uname, :dest, :spot, :rating, :comment)
        """)
        db.execute(query, {
            "uid": req.user_id,
            "uname": req.user_name,
            "dest": req.destination,
            "spot": req.spot_name,
            "rating": req.rating,
            "comment": req.comment
        })
        db.commit()
        return {"message": "Review submitted successfully"}
    except Exception as e:
        db.rollback()
        print(f"MySQL Review Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@router.get("/reviews/{destination}")
def get_destination_reviews(destination: str, db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT id, user_name, spot_name, rating, comment, created_at
            FROM reviews
            WHERE destination = :dest
            ORDER BY created_at DESC
        """)
        results = db.execute(query, {"dest": destination}).fetchall()
        reviews = []
        for r in results:
            reviews.append({
                "id": r[0],
                "user_name": r[1],
                "spot_name": r[2],
                "rating": r[3],
                "comment": r[4],
                "created_at": str(r[5])
            })
        return reviews
    except Exception as e:
        print(f"MySQL Review Fetch Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")