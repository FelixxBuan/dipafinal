import os
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient

# Assuming 'recommend' function is in 'recommendation.py'
from recommendation import recommend

# Load environment variables at the very top
load_dotenv()

app = FastAPI(
    title="UniFinder API",
    description="API for UniFinder, providing program recommendations and data.",
    version="1.0.0",
)

# --- Configuration ---
# 🌍 CORS Setup
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable not set. Please add it to your .env file.")

try:
    client = MongoClient(MONGO_URI)
    db = client["unifinder"]
    # Ping the database to ensure connection is established
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    # Depending on your deployment, you might want to exit or handle this more gracefully
    # For now, we'll raise an error to stop the application startup
    raise RuntimeError(f"Could not connect to MongoDB: {e}")

# --- Pydantic Models ---
class SearchRequest(BaseModel):
    """
    Model for the request body of the main search endpoint.
    """
    answers: dict
    school_type: str = "any"
    locations: Optional[List[str]] = None
    max_budget: Optional[float] = None

# --- API Endpoints ---

@app.get("/programs/all", summary="Get all programs from the database")
async def get_all_programs():
    """
    Retrieves all university programs stored in the 'all_programs' collection.
    """
    try:
        collection = db["all_programs"]
        data = list(collection.find({}, {"_id": 0}))
        return JSONResponse(content=data)
    except Exception as e:
        # Log the actual exception for debugging
        print(f"Error fetching all programs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching all programs.")

@app.post("/search", summary="Get program recommendations based on user answers and filters")
async def search(request_data: SearchRequest):
    """
    Provides university program recommendations based on a user's answers
    and specified filters like school type, location, and maximum budget.
    """
    print("📥 Received search request")
    # The 'recommend' function should ideally handle its own errors or return a clear status.
    # For now, we'll assume it returns the result directly.
    result = recommend(
        answers=request_data.answers,
        school_type=request_data.school_type,
        locations=request_data.locations,
        max_budget=request_data.max_budget,
    )
    return result

@app.get("/programs/from-file", summary="Get program vectors (deprecated or specific use)")
async def get_programs_from_file():
    """
    Retrieves program vector data.
    Consider if this endpoint is truly needed or can be merged/renamed with /programs/all
    if 'program_vectors' and 'all_programs' collections serve similar data.
    """
    try:
        collection = db["program_vectors"]
        data = list(collection.find({}, {"_id": 0}))
        return JSONResponse(content=data)
    except Exception as e:
        print(f"Error fetching program vectors from file: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching program vectors.")




@app.get("/api/school-strengths", summary="Get school strengths data")
async def get_school_strengths():
    """
    Retrieves all school strengths data from the 'school_strengths' collection.
    """
    try:
        collection = db["school_strengths"]
        docs = list(collection.find({}, {"_id": 0}))
        if docs:
            return JSONResponse(content={"schools": docs})
        else:
            print("⚠️ No school_strengths data found in MongoDB.")
            return JSONResponse(content={"schools": []}, status_code=200)
    except Exception as e:
        print(f"❌ Error fetching school_strengths: {e}")
        raise HTTPException(status_code=500, detail=f"Database error while fetching school strengths: {e}")


@app.get("/school-rankings", summary="Get school rankings data")
async def get_school_rankings():
    """
    Retrieves school rankings data from the 'school_rankings' collection.
    """
    try:
        collection = db["school_rankings"]
        doc = collection.find_one({}, {"_id": 0})
        return JSONResponse(content=doc if doc else {}, status_code=200)
    except Exception as e:
        print(f"❌ Error fetching school_rankings: {e}")
        raise HTTPException(status_code=500, detail=f"Database error while fetching school rankings: {e}")

@app.get("/programs/search", summary="Search programs by name, location, or category")
async def search_programs(
    name: Optional[str] = Query(None, max_length=100, description="Name of the program (case-insensitive partial match)"),
    location: Optional[str] = Query(None, max_length=100, description="Location of the school (case-insensitive partial match)"),
    category: Optional[str] = Query(None, max_length=100, description="Category of the program (e.g., 'business', 'technology')")
):
    """
    Searches for university programs based on optional filters:
    - **name**: Filter by program name (case-insensitive partial match).
    - **location**: Filter by school location (case-insensitive partial match).
    - **category**: Filter by program category.
    """
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if category:
        query["category"] = {"$regex": category, "$options": "i"}

    try:
        data = list(db["all_programs"].find(query, {"_id": 0}))
        return JSONResponse(content=data)
    except Exception as e:
        print(f"Error searching programs: {e}")
        raise HTTPException(status_code=500, detail=f"Database error during program search: {e}")