import hashlib
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.config import get_db
from app.schemas.request_schema import UserRegister, UserLogin
from app.routes.trip_routes import router as trip_router
from app.routes.chat_routes import router as chat_router

app = FastAPI(title="TripBuddy API")

# Explicit CORS headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trip_router)
app.include_router(chat_router)

def hash_password(password: str) -> str:
    # Reliable SHA256 hashing without external C-extension binary dependencies
    salt = "tripbuddy_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

@app.post("/api/auth/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    try:
        existing = db.execute(text("SELECT id FROM users WHERE email = :e"), {"e": user.email}).fetchone()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        pwd_hash = hash_password(user.password)
        db.execute(
            text("INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :pwd)"),
            {"name": user.name, "email": user.email, "pwd": pwd_hash}
        )
        db.commit()
        
        new_user = db.execute(text("SELECT id, name, email FROM users WHERE email = :e"), {"e": user.email}).fetchone()
        return {"id": new_user[0], "name": new_user[1], "email": new_user[2]}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        record = db.execute(text("SELECT id, name, email, password_hash FROM users WHERE email = :e"), {"e": user.email}).fetchone()
        if not record:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        pwd_hash = hash_password(user.password)
        if record[3] != pwd_hash:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        return {"id": record[0], "name": record[1], "email": record[2]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/")
def root():
    return {"status": "TripBuddy API is running"}