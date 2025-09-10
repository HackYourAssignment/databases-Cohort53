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
    await db.query(`DROP TABLE IF EXISTS account_changes;`);
    await db.query(`DROP TABLE IF EXISTS account;`);

    await db.query(`
      CREATE TABLE account (
        account_number INTEGER PRIMARY KEY,
        balance        NUMERIC(12,2) NOT NULL CHECK (balance >= 0)
      );
    `);

    await db.query(`
      CREATE TABLE account_changes (
        change_number  BIGSERIAL PRIMARY KEY,
        account_number INTEGER NOT NULL REFERENCES account(account_number) ON DELETE CASCADE,
        amount         NUMERIC(12,2) NOT NULL,
        changed_date   TIMESTAMPTZ   NOT NULL DEFAULT now(),
        remark         TEXT NOT NULL
      );
    `);

    console.log("tables created");
  } finally {
    await db.end();
  }
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
