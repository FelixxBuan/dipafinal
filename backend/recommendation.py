from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy as np

from db import db  # shared DB connection

# Load sentence transformer model
model = SentenceTransformer("all-mpnet-base-v2")

# Load program data from DB
program_data = list(db["program_vectors"].find({}, {"_id": 0}))

# Load rankings data
rankings_doc = db["school_rankings"].find_one({}, {"_id": 0})
rankings_data = rankings_doc["programs"] if rankings_doc and "programs" in rankings_doc else {}

THRESHOLD = 0.4
CATEGORY_WEIGHT = 0.3  # weight of the school rating in final score


def get_school_rating(school_name, category):
    ranked_list = rankings_data.get(category, [])
    for school in ranked_list:
        if school_name.lower() in school["school"].lower():
            return school["rating"]
    return None


def recommend(answers: dict, school_type: str = None, locations: list[str] = None, max_budget: float = None):
    print("\n📊 Starting Program Matching Breakdown")

    # Step 1: Vectorize user answers
    vectors = {}
    for key in ["academics", "fields", "activities", "goals", "environment"]:
        items = answers.get(key, [])
        custom = answers.get("custom", {}).get(key, "")
        merged = items + ([custom] if custom.strip() else [])
        text = " ".join(merged)
        if text.strip():
            vec = model.encode(text)
        else:
            vec = np.zeros(model.get_sentence_embedding_dimension())
        vectors[key] = vec

    valid_vectors = [v for v in vectors.values() if np.linalg.norm(v) > 0]
    if not valid_vectors:
        return {
            "type": "fallback",
            "message": "No valid input provided. Please answer at least one question.",
            "results": [],
            "weak_matches": []
        }

    combined_vector = np.mean(valid_vectors, axis=0).reshape(1, -1)

    # Step 2: Match against programs
    strong_matches = []
    weak_matches = []

    for entry in program_data:
        try:
            entry_type = entry.get("school_type", "").lower()

            # 🎓 School type filter
            if school_type and school_type.lower() != "any":
                if entry_type != school_type.lower():
                    continue

            # 📍 Location filter
            if locations:
                entry_location = entry.get("location", "").lower()
                if all(loc.lower() not in entry_location for loc in locations):
                    continue

            # 💰 Budget filter
            if max_budget is not None:
                tuition = entry.get("tuition_per_semester")
                if tuition is not None and isinstance(tuition, (int, float)) and tuition > max_budget:
                    continue

            # 📈 Cosine similarity
            program_vector = np.array(entry["vector"]).reshape(1, -1)
            similarity_score = cosine_similarity(program_vector, combined_vector)[0][0]

            category = entry.get("category")
            rating_score = get_school_rating(entry["school"], category) or 0
            final_score = round((similarity_score * (1 - CATEGORY_WEIGHT)) + (rating_score / 10 * CATEGORY_WEIGHT), 3)

            result_item = {
                "school": entry["school"],
                "program": entry["name"],
                "description": entry["description"],
                "score": final_score,
                "tuition_per_semester": entry.get("tuition_per_semester"),
                "tuition_annual": entry.get("tuition_annual"),
                "tuition_notes": entry.get("tuition_notes"),
                "admission_requirements": entry.get("admission_requirements"),
                "grade_requirements": entry.get("grade_requirements"),
                "school_requirements": entry.get("school_requirements"),
                "school_website": entry.get("school_website"),
                "school_type": entry.get("school_type"),
                "location": entry.get("location"),
                "school_logo": entry.get("school_logo"),
                "board_passing_rate": entry.get("board_passing_rate"),
                "category": category,
            }

            if similarity_score >= THRESHOLD:
                strong_matches.append(result_item)
            else:
                weak_matches.append(result_item)

        except Exception as e:
            print(f"⚠️ Skipping invalid entry: {e}")
            continue

    strong_matches.sort(key=lambda x: x["score"], reverse=True)
    weak_matches.sort(key=lambda x: x["score"], reverse=True)

    top_category = strong_matches[0].get("category") if strong_matches else None
    top_ranked_schools = rankings_data.get(top_category, [])[:5] if top_category else []

    # Fallback if no strong matches
    if not strong_matches:
        fallback_results = weak_matches[:6]  # suggest at least 6 programs
        fallback_weak = weak_matches[6:12] if len(weak_matches) > 6 else []

        return {
            "type": "fallback",
            "message": "We couldn't find a strong match for your interest, so here are a few programs you might explore or Click Try Again!",
            "results": fallback_results,
            "weak_matches": fallback_weak,
            "matched_category": top_category,
            "top_schools_for_category": top_ranked_schools
        }

    return {
        "type": "exact",
        "results": strong_matches[:10],
        "weak_matches": weak_matches[:10],
        "matched_category": top_category,
        "top_schools_for_category": top_ranked_schools
    }
