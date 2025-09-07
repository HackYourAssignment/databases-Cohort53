import { accounts, account_changes } from "./data.js";
import { Client } from "pg";

// Database connection configuration
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "transactions_week3",
  port: 5432,
};
const client = new Client(config);

async function seedDatabase(client) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Insert accounts
    for (const account of accounts) {
      const insertAccountQuery = {
        text: "INSERT INTO account(account_number, balance) VALUES($1, $2) ON CONFLICT (account_number) DO NOTHING",
        values: Object.values(account),
      };
      await client.query(insertAccountQuery);
    }

    // Insert account_changes
    for (const change of account_changes) {
      const insertChangeQuery = {
        text: `INSERT INTO account_changes(account_number, amount, changed_date, remark)
        VALUES($1, $2, $3, $4)`,
        values: Object.values(change),
      };
      await client.query(insertChangeQuery);
    }

    // ...existing code...
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase(client);
