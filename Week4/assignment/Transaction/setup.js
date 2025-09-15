import { transactionsCollection } from "./db.js";
export async function createAccounts() {
  try {
    await transactionsCollection.deleteMany({});
    const accounts = [
      {
        account_number: 102,
        balance: 5000,
        account_changes: [],
      },
      {
        account_number: 103,
        balance: 10000,
        account_changes: [],
      },
    ];

    const result = await transactionsCollection.insertMany(accounts);

    console.log(`Inserted ${result.insertedCount} accounts`);
    return result;
  } catch (error) {
    console.error("Error creating accounts:", error);
  }
}

export async function showAccounts() {
  try {
    const result = await transactionsCollection.find({}).toArray();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error showing accounts:", error);
  }
}
