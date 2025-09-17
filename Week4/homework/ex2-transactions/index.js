require("dotenv").config({ path: "D:/HYF/databases-Cohort53/Week4/.env" });

const { MongoClient } = require("mongodb");

const setupAccounts = require("./setup");
const transfer = require("./transfer");

async function main() {
  const uri = process.env.MONGODB_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db("databaseWeek4").collection("accounts");

    await setupAccounts(collection);

    await transfer(collection, 101, 102, 1000, "Test transfer");

    const accounts = await collection.find().toArray();
    console.log(accounts);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
