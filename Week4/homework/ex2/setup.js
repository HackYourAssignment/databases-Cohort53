// Week4/homework/ex2-transactions/setup.js
import "dotenv/config";
import { MongoClient } from "mongodb";

const DB = "databaseWeek4";
const COLL = "accounts";

export async function setup() {
  const client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();
  try {
    const db = client.db(DB);
    const col = db.collection(COLL);

    await col.drop().catch(() => {});
    await db.createCollection(COLL);

    await col.createIndex({ account_number: 1 }, { unique: true });

    const now = new Date();
    await col.insertMany([
      {
        account_number: 101,
        balance: 5000,
        account_changes: [
          {
            change_number: 1,
            amount: 5000,
            changed_date: now,
            remark: "initial deposit",
          },
        ],
      },
      {
        account_number: 102,
        balance: 1000,
        account_changes: [
          {
            change_number: 1,
            amount: 1000,
            changed_date: now,
            remark: "initial deposit",
          },
        ],
      },
    ]);

    console.log("setup: accounts seeded");
  } finally {
    await client.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setup().catch(console.error);
}
