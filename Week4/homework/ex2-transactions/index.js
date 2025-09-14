import { connectToDatabase, closeDatabase } from "./connectDatabase.js";
import { setupAccounts } from "./setup.js";
import { transfer } from "./transfer.js";

async function main() {
  try {
    // Step 1: Setup sample accounts
    await setupAccounts();

    // Step 2: Transfer 1000 from account 101 to account 102
    await transfer(101, 102, 1000, "Test transfer");

    // Step 3: Fetch and log accounts to verify
    const { db } = await connectToDatabase("databaseWeek4");
    const accounts = await db.collection("accounts").find().toArray();
    console.log(accounts);
  } catch (err) {
    console.error("❌ Error in main:", err.message);
  } finally {
    // Always close the DB connection at the end
    await closeDatabase();
  }
}

main();
