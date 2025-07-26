const { MongoClient } = require("mongodb");
const fs = require("fs");

const uri = "mongodb+srv://felixxbuan:QodcG7NvTkttyTUB@cluster0.poimocp.mongodb.net/";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("unifinder");
    const collection = db.collection("schools");

    const data = JSON.parse(fs.readFileSync("program_vectors.json", "utf8"));
    await collection.insertMany(data);

    console.log("✅ Data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    await client.close();
  }
}

run();
