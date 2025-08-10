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


@app.get("/programs/showcase", summary="Get a static list of showcase programs")
async def get_program_showcase():
    """
    Returns a predefined static list of showcase university programs.
    This is useful for front-end demonstration or initial display.
    """
    return [
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "BS Business Administration - Operations Management",
            "category": "business",
            "icon": "Briefcase",
            "description": "Focuses on streamlining business logistics, production, and supply chain efficiency.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "HS diploma, entrance exam, interview.",
            "grade_requirements": "85% in Math and English.",
            "school_requirements": "Form 138, PSA Birth Certificate, Certificate of Good Moral.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "BS Computer Science",
            "category": "technology",
            "icon": "Code",
            "description": "Covers algorithms, data structures, and software design, preparing students for tech careers.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "Entrance exam and interview.",
            "grade_requirements": "GWA 85%, strong Math background.",
            "school_requirements": "Form 138, PSA, good moral, 2x2 ID picture.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "BS Architecture",
            "category": "design",
            "icon": "Ruler",
            "description": "Covers architectural design, building technology, and planning for urban and rural settings.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "Drawing exam, HS diploma.",
            "grade_requirements": "85% in Math and Arts-related subjects.",
            "school_requirements": "Form 138, PSA, portfolio (if any), good moral.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "BS Nursing",
            "category": "health",
            "icon": "Stethoscope",
            "description": "Trains students in patient care, health assessment, and clinical practice.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "HS diploma, entrance test.",
            "grade_requirements": "GWA 83%, must pass nursing aptitude test.",
            "school_requirements": "Form 138, PSA, good moral certificate.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "Bachelor of Secondary Education - English",
            "category": "education",
            "icon": "BookOpen",
            "description": "Prepares high school English teachers with strong foundations in literature and communication.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "Interview, entrance exam.",
            "grade_requirements": "Minimum GWA of 85%, English grade 87% or above.",
            "school_requirements": "Form 138, good moral, PSA birth certificate.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "BS Civil Engineering",
            "category": "engineering",
            "icon": "Wrench",
            "description": "Prepares students to design, construct, and maintain infrastructure and public works.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "Entrance exam, interview.",
            "grade_requirements": "At least 85% in Math and Science.",
            "school_requirements": "Form 138, good moral, PSA birth certificate.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "BS Biology",
            "category": "science",
            "icon": "FlaskConical",
            "description": "Focuses on biological sciences, preparing students for research, teaching, or medical careers.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "HS diploma, entrance exam.",
            "grade_requirements": "Minimum of 85% in Science and Math.",
            "school_requirements": "Form 138, PSA, medical clearance.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "Bachelor of Fine Arts",
            "category": "arts",
            "icon": "Palette",
            "description": "Focuses on visual arts, multimedia, and design fundamentals for creative careers.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "Art portfolio, HS diploma, entrance test.",
            "grade_requirements": "80% GWA with strength in art subjects.",
            "school_requirements": "Form 138, good moral, PSA.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "BS Criminology",
            "category": "law",
            "icon": "ShieldCheck",
            "description": "Studies criminal behavior, law enforcement, and forensic science for public safety careers.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "Entrance exam, HS graduate.",
            "grade_requirements": "GWA 80%, no failing grade in behavior.",
            "school_requirements": "Form 138, good moral, PSA.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        },
        {
            "school": "Don Honorio Ventura State University",
            "school_logo": "/logos/psu.png",
            "name": "Bachelor of Science in Psychology",
            "category": "social_science",
            "icon": "Brain",
            "description": "Explores mental processes, behavior, and human development for counseling or research careers.",
            "tuition_per_semester": None,
            "tuition_annual": None,
            "tuition_notes": "Miscellaneous fees not included, varies by campus and program.",
            "admission_requirements": "Interview, entrance test.",
            "grade_requirements": "80% average or above.",
            "school_requirements": "Form 138, good moral certificate, PSA.",
            "school_website": "https://www.dhvsu.edu.ph",
            "location": "Mexico, Pampanga",
            "school_type": "Public"
        }
    ]

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