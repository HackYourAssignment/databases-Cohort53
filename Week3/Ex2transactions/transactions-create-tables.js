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

async function createTables(client) {
  const CREATE_ACCOUNT_TABLE = `
    CREATE TABLE IF NOT EXISTS account (
    account_number SMALLINT PRIMARY KEY,
    balance INTEGER
    )`;

  const CREATE_ACCOUNT_CHANGES_TABLE = `
    CREATE TABLE IF NOT EXISTS account_changes (
    change_number SERIAL PRIMARY KEY,
    account_number SMALLINT,
    amount INTEGER,
    changed_date DATE,
    remark VARCHAR(100),
    FOREIGN KEY (account_number) REFERENCES account(account_number) ON DELETE CASCADE
    )`;
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create tables
    await client.query(CREATE_ACCOUNT_TABLE);
    await client.query(CREATE_ACCOUNT_CHANGES_TABLE);
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await client.end();
  }
}

createTables(client);
