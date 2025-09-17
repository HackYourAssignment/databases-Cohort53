const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "databaseWeek4";
const collectionName = "accounts";

async function setupAccounts() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Clear existing data
    await collection.deleteMany({});

    // Insert sample accounts
    const sampleAccounts = [
      {
        account_number: 101,
        balance: 5000,
        account_changes: [
          {
            change_number: 1,
            amount: 5000,
            changed_date: new Date(),
            remark: "Initial deposit",
          },
        ],
      },
      {
        account_number: 102,
        balance: 2000,
        account_changes: [
          {
            change_number: 1,
            amount: 2000,
            changed_date: new Date(),
            remark: "Initial deposit",
          },
        ],
      },
    ];

    await collection.insertMany(sampleAccounts);
    console.log("Accounts set up successfully");
  } catch (err) {
    console.error("Error setting up accounts:", err);
    throw err;
  } finally {
    await client.close();
  }
}

module.exports = { setupAccounts };

// Run setup
setupAccounts();
