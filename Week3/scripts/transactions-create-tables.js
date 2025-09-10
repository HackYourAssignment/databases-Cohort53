import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "week3",
});

async function createTables() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    await client.query(`
      CREATE TABLE IF NOT EXISTS account(
      account_number INT PRIMARY KEY,
      balance INT
      ) `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS account_changes(
        change_number SERIAL PRIMARY KEY,
        account_number INT REFERENCES account (account_number), 
        amount INT, 
        changed_date DATE, 
        remark TEXT
      ) `);
  } catch (err) {
    console.log("Error:", err);
  } finally {
    await client.end();
  }
}

createTables();
