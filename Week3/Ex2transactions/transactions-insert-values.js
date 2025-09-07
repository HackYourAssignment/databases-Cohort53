import { accounts, account_changes } from "./data.js";
import { Client } from "pg";
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "transactions_week3",
  port: 5432,
};
const client = new Client(config);

async function seedDatabase(client, accounts, account_changes) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    for (const account of accounts) {
      const INSERT_ACCOUNT_QUERY = {
        text: "INSERT INTO account(account_number, balance) VALUES($1, $2) ON CONFLICT (account_number) DO NOTHING",
        values: Object.values(account),
      };
      await client.query(INSERT_ACCOUNT_QUERY);
    }

    for (const change of account_changes) {
      const INSERT_CHANGE_QUERY = {
        text: `INSERT INTO account_changes(account_number, amount, changed_date, remark) VALUES($1, $2, $3, $4)`,
        values: Object.values(change),
      };
      await client.query(INSERT_CHANGE_QUERY);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase(client, accounts, account_changes);
