import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let _client = null;

export async function connectToDatabase(dbName) {
  if (!_client) {
    const connectionString = process.env.MONGODB_URL;
    if (!connectionString)
      throw new Error("MONGODB_URL is not defined in .env");
    _client = new MongoClient(connectionString);
    await _client.connect();
    console.log("✅ MongoDB connected");
  }
  const finalDbName = dbName || process.env.DB_NAME || "test";
  const db = _client.db(finalDbName);
  return { db, client: _client };
}

export async function closeDatabase() {
  if (_client) {
    await _client.close();
    _client = null;
    console.log("🔒 MongoDB connection closed");
  }
}
