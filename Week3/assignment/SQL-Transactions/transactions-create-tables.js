import pool from "./main.js";

export async function createTables() {
  try {
    // Drop tables if they exist
    await pool.query("DROP TABLE IF EXISTS account_changes");
    await pool.query("DROP TABLE IF EXISTS account");
    console.log("Tables dropped successfully");

    // Create account table first
    const createAccount = `CREATE TABLE IF NOT EXISTS account (
    account_number SERIAL PRIMARY KEY,
    balance NUMERIC(15,2)
);`;

    await pool.query(createAccount);
    console.log("Account table created");

    // Then create account_changes table
    const createAccountChanges = `CREATE TABLE IF NOT EXISTS account_changes (
    change_number SERIAL PRIMARY KEY,
    account_number INTEGER,
    Foreign Key (account_number) REFERENCES account(account_number),
    amount NUMERIC(15,2),
    changed_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    remark TEXT
);`;

    await pool.query(createAccountChanges);
    console.log("Account_changes table created");
  } catch (error) {
    console.error("Error", error);
  } 
}

