import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI not set in .env file")

client = MongoClient(MONGO_URI)
db = client["unifinder"]

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB successfully")
except Exception as e:
    raise RuntimeError(f"❌ Could not connect to MongoDB: {e}")
