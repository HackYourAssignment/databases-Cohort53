const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const dbName = "financeDB";
async function insertAccount(client) {
  await client.db(dbName).collection("accounts").deleteMany({});
  const res = await client
    .db(dbName)
    .collection("accounts")
    .insertMany([
      {
        account_number: 1,
        balance: 5000,
        account_changes: [
          {
            change_number: 1,
            change_amount: 500,
            change_date: new Date("2025-09-17"),
            remark: "gift",
          },
          {
            change_number: 2,
            change_amount: -200,
            change_date: new Date("2025-09-18"),
            remark: "withdrawal",
          },
          {
            change_number: 3,
            change_amount: 300,
            change_date: new Date("2025-09-19"),
            remark: "deposit",
          },
        ],
      },
      {
        account_number: 2,
        balance: 3000,
        account_changes: [
          {
            change_number: 1,
            change_amount: 1000,
            change_date: new Date("2025-09-17"),
            remark: "salary",
          },
          {
            change_number: 2,
            change_amount: -500,
            change_date: new Date("2025-09-18"),
            remark: "bills",
          },
          {
            change_number: 3,
            change_amount: 200,
            change_date: new Date("2025-09-19"),
            remark: "freelance",
          },
        ],
      },
    ]);
}

async function main() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected successfully to server");

    await insertAccount(client);
    console.log("Inserted accounts");
  } catch (err) {
    console.log(err.message);
  } finally {
    await client.close();
  }
}
module.exports = main;
