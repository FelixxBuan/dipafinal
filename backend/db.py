import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load env variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI not set in .env file")

# Single MongoClient instance (recommended)
client = MongoClient(MONGO_URI)
db = client["unifinder"]

# Test connection
try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB successfully")
except Exception as e:
    raise RuntimeError(f"❌ Could not connect to MongoDB: {e}")
