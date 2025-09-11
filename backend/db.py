from pymongo import MongoClient
import os

# Get MongoDB connection string from environment variable
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("❌ MONGO_URI environment variable is not set!")

# Create the MongoDB client with TLS enabled
client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsAllowInvalidCertificates=True  # fallback for Render SSL issues
)

# Test the connection
try:
    client.admin.command("ping")
    print("✅ MongoDB connection established!")
except Exception as e:
    raise RuntimeError(f"❌ Could not connect to MongoDB: {e}")

# Get default database (from URI)
db = client.get_database()
