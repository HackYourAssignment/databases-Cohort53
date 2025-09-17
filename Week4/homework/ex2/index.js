// Week4/homework/ex2-transactions/index.js
import "dotenv/config";
import { MongoClient } from "mongodb";
import { setup } from "./setup.js";
import { transfer } from "./transfer.js";

const DB = "databaseWeek4";
const COLL = "accounts";

async function showAccounts(label) {
  const client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();
  try {
    const docs = await client
      .db(DB)
      .collection(COLL)
      .find({}, { projection: { _id: 0 } })
      .sort({ account_number: 1 })
      .toArray();
    console.log(`\n=== ${label} ===`);
    console.table(
      docs.map((d) => ({
        account_number: d.account_number,
        balance: d.balance,
        last_change: d.account_changes?.[d.account_changes.length - 1],
      }))
    );
  } finally {
    await client.close();
  }
}

async function main() {
  await setup();

  await showAccounts("Before transfer");

  await transfer({
    from: 101,
    to: 102,
    amount: 1000,
    remark: "lesson W4 transfer",
  });

  await showAccounts("After transfer");
}

main().catch(console.error);
