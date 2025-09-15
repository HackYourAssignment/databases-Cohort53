import { client } from "./db.js";
import { createAccounts, showAccounts } from "./setup.js";
import { transferMoney } from "./transfer.js";

async function connectToDatabase() {
  try {
    await client.connect();
    console.log(`Successfully connected to MongoDB`);
    await createAccounts();
    await showAccounts();
    await transferMoney(102, 103, 900);
    await showAccounts();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

connectToDatabase();
