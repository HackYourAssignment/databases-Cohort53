// Week3/assignment/transactions-insert-values.js
// Inserts test accounts and initial seed transactions.

import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Client } = pg;

const db = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "research",
});

async function run() {
  await db.connect();
  try {
    // Reset data
    await db.query(`TRUNCATE account_changes, account RESTART IDENTITY;`);

    // Insert accounts
    await db.query(`
      INSERT INTO account(account_number, balance) VALUES
        (101, 5000.00),
        (102, 2000.00),
        (103, 150.00);
    `);

    // Insert account_changes log
    await db.query(`
      INSERT INTO account_changes(account_number, amount, remark) VALUES
        (101, 5000.00, 'initial funding'),
        (102, 2000.00, 'initial funding'),
        (103, 150.00,  'initial funding');
    `);

    console.log("✅ Accounts and seed transactions inserted");
  } finally {
    await db.end();
  }
}

run().catch((e) => {
  console.error("Mistake", e.message);
  process.exit(1);
});
