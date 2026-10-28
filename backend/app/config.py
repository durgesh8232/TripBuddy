import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:root@localhost:3306/tripbuddy_db")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkeytripbuddy2026")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Tests connection liveness before running queries and auto-reconnects
    pool_recycle=300,        # Refreshes connections every 5 minutes to beat TiDB/MySQL idle drop
    pool_size=5,             # Stable connection count for cloud container environments
    max_overflow=10,         # Handles occasional traffic spikes
    connect_args={
        "connect_timeout": 60
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()