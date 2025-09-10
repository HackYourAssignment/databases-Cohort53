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

async function transfer(fromAcc, toAcc, amount) {
  await db.query("BEGIN");
  try {
    // 1) Lock both accounts
    const fromRes = await db.query(
      "SELECT balance FROM account WHERE account_number = $1 FOR UPDATE",
      [fromAcc]
    );
    const toRes = await db.query(
      "SELECT balance FROM account WHERE account_number = $1 FOR UPDATE",
      [toAcc]
    );

    if (fromRes.rowCount === 0 || toRes.rowCount === 0) {
      throw new Error("Account not found");
    }

    const fromBal = Number(fromRes.rows[0].balance);
    if (fromBal < amount) throw new Error("Insufficient funds");

    // 2) Update balances
    await db.query(
      "UPDATE account SET balance = balance - $1 WHERE account_number = $2",
      [amount, fromAcc]
    );
    await db.query(
      "UPDATE account SET balance = balance + $1 WHERE account_number = $2",
      [amount, toAcc]
    );

    // 3) Log changes
    await db.query(
      "INSERT INTO account_changes(account_number, amount, remark) VALUES ($1, $2, $3)",
      [fromAcc, -amount, `transfer to ${toAcc}`]
    );
    await db.query(
      "INSERT INTO account_changes(account_number, amount, remark) VALUES ($1, $2, $3)",
      [toAcc, amount, `transfer from ${fromAcc}`]
    );

    await db.query("COMMIT");
    console.log(` Transferred ${amount} from ${fromAcc} to ${toAcc}`);
  } catch (e) {
    await db.query("ROLLBACK");
    throw e;
  }
}

async function run() {
  await db.connect();
  try {
    await transfer(101, 102, 1000.0);
  } finally {
    await db.end();
  }
}

run().catch((e) => {
  console.error("Mistake", e.message);
  process.exit(1);
});
