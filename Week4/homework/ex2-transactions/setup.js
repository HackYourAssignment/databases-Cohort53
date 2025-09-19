import { MongoClient } from "mongodb";
import "dotenv/config";
import fs from "fs";

export async function setup() {
  const { accounts, account_changes } = JSON.parse(
    fs.readFileSync("./Week4/homework/ex2-transactions/data.json")
  );
  const clientMongo = new MongoClient(process.env.MONGODB_URL);
  await clientMongo.connect();
  const db = clientMongo.db("databaseWeek4");
  const account = await db.createCollection("accounts");
  await account.deleteMany({});
  for (const acc of accounts) {
    acc.account_changes = account_changes
      .filter((a) => a.account_number === acc.account_number)
      .map((a) => {
        delete a.account_number;
        return a;
      });
    await account.insertOne(acc);
  }
  return { clientMongo, account };
}
