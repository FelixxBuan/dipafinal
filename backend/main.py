import os
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from backend.db import db  # ✅ shared DB connection
from backend.recommendation import recommend

# Load env
load_dotenv()

app = FastAPI(
    title="UniFinder API",
    description="API for UniFinder, providing program recommendations and data.",
    version="1.0.0",
)

# --- Configuration ---
# 🌍 CORS Setup
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
print("ALLOWED_ORIGINS:", ALLOWED_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    try:
        collection = db["all_programs"]
        data = list(collection.find({}, {"_id": 0}))
        return JSONResponse(content=data)
    except Exception as e:
        print(f"Error fetching all programs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching all programs.")


@app.post("/search", summary="Get program recommendations based on user answers and filters")
async def search(request_data: SearchRequest):
    print("📥 Received search request")
    result = recommend(
        answers=request_data.answers,
        school_type=request_data.school_type,
        locations=request_data.locations,
        max_budget=request_data.max_budget,
    )
    return result


@app.get("/programs/from-file", summary="Get program vectors (deprecated or specific use)")
async def get_programs_from_file():
    try:
        collection = db["program_vectors"]
        data = list(collection.find({}, {"_id": 0}))
        return JSONResponse(content=data)
    except Exception as e:
        print(f"Error fetching program vectors from file: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching program vectors.")


@app.get("/api/school-strengths", summary="Get school strengths data")
async def get_school_strengths():
    try:
        collection = db["school_strengths"]
        docs = list(collection.find({}, {"_id": 0}))
        return JSONResponse(content={"schools": docs})
    except Exception as e:
        print(f"❌ Error fetching school_strengths: {e}")
        raise HTTPException(status_code=500, detail=f"Database error while fetching school strengths: {e}")


@app.get("/school-rankings", summary="Get school rankings data")
async def get_school_rankings():
    try:
        collection = db["school_rankings"]
        doc = collection.find_one({}, {"_id": 0})
        return JSONResponse(content=doc if doc else {}, status_code=200)
    except Exception as e:
        print(f"❌ Error fetching school_rankings: {e}")
        raise HTTPException(status_code=500, detail=f"Database error while fetching school rankings: {e}")


@app.get("/programs/search", summary="Search programs by name, location, or category")
async def search_programs(
    name: Optional[str] = Query(None, max_length=100),
    location: Optional[str] = Query(None, max_length=100),
    category: Optional[str] = Query(None, max_length=100),
):
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
