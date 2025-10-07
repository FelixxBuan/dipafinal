import os
from dotenv import load_dotenv
from pymongo import MongoClient

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("❌ MONGO_URI not set in .env file")

client = MongoClient(MONGO_URI)
db = client["unifinder"]

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB successfully")
except Exception as e:
    raise RuntimeError(f"❌ Could not connect to MongoDB: {e}")
