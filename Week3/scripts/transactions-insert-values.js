import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "week3",
});

async function insertValues() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    await client.query(`
      INSERT INTO account (account_number, balance) VALUES
        (101, 5000),
        (102, 3000),
        (103, 7000)
    `);

    await client.query(`
      INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES
        (101, 1000, '2025-09-10', 'Initial deposit'),
        (102, 2000, '2025-09-10', 'Initial deposit'),
        (103, 1500, '2025-09-10', 'Initial deposit')
    `);
  } catch (err) {
    console.log(("Error:", err));
  } finally {
    await client.end();
  }
}

insertValues();
