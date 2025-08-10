import json
from pymongo import MongoClient

# MongoDB connection
MONGO_URI = "mongodb+srv://felixxbuan:QodcG7NvTkttyTUB@cluster0.poimocp.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["unifinder"]
collection = db["school_strengths"]

# Load JSON file
with open("school_strengths.json", "r", encoding="utf-8") as f:
    data = json.load(f)

documents = []

if isinstance(data, list):
    # Already a list of documents
    for doc in data:
        doc.pop("_id", None)  # remove existing _id to avoid duplicates
        documents.append(doc)
elif isinstance(data, dict):
    # Dict where keys are school names
    for name, details in data.items():
        doc = {"name": name}
        doc.update(details)
        documents.append(doc)
else:
    print("Unexpected JSON format.")

# Insert into MongoDB
if documents:
    collection.insert_many(documents)
    print(f"Inserted {len(documents)} documents into 'school_strengths' collection.")
else:
    print("No documents to insert.")
