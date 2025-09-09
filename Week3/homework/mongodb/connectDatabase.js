import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let _client = null;

// Connect to database
export async function connectToDatabase(dbName) {
  if (!_client) {
    const connectionString = process.env.MONGODB_URL;
    _client = await MongoClient.connect(connectionString);
  }

  const finalDbName = dbName || process.env.DB_NAME || "test";
  const db = _client.db(finalDbName);

  console.log(`✅ Connected to database: ${db.databaseName}`);
  return db;
}

connectToDatabase();
