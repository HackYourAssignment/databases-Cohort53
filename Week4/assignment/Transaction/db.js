import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) throw new Error("MONGODB_URL is not defined in .env");
const client = new MongoClient(MONGODB_URL);
const db = client.db("Transfer");
const transactionsCollection = db.collection("transactions");

export { client, transactionsCollection };
