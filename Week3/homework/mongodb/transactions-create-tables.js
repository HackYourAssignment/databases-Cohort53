import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "hyfuser",
  host: "localhost",
  database: "HYFBank",
  password: "hyfpassword",
  port: 5432,
});

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS account (
        account_number INT PRIMARY KEY,
        balance NUMERIC(12,2) NOT NULL
      );
    `);

    // Create account_changes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS account_changes (
        change_number SERIAL PRIMARY KEY,
        account_number INT REFERENCES account(account_number),
        amount NUMERIC(12,2) NOT NULL,
        changed_date TIMESTAMP DEFAULT NOW(),
        remark TEXT
      );
    `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

createTables();
