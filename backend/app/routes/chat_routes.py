from fastapi import APIRouter, HTTPException
from app.schemas.request_schema import ChatRequest
from app.services.gemini_service import answer_travel_chat

router = APIRouter(prefix="/api", tags=["Chat"])

@router.post("/chat")
def chat_with_tripbuddy(req: ChatRequest):
    try:
        reply = answer_travel_chat(req.message, req.destination, req.context)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))