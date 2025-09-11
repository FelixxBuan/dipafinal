from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("❌ MONGO_URI environment variable is not set!")

# Directly connect
client = MongoClient(MONGO_URI)

# Pick the database (moodoro)
db = client.get_database("moodoro")

print("✅ MongoDB connection initialized")
