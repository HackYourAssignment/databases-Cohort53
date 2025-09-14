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
  await account.insertMany(accounts);
  const accountChanges = await db.createCollection("account_changes");
  await accountChanges.deleteMany({});
  await accountChanges.insertMany(account_changes);
  return { clientMongo, account, accountChanges };
}
