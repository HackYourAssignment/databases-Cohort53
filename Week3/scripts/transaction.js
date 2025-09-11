import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "week3",
});

async function runTransfer() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    await client.query("BEGIN");

    await client.query(`
      UPDATE account
      SET balance = balance - 1000
      WHERE account_number = 101
      `);

    await client.query(`     
      UPDATE account
      SET balance  = balance + 1000
      WHERE account_number = 102
      `);

    await client.query(
      `INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES
      ($1, $2, CURRENT_DATE, $3)`,
      [101, -1000, "Transfer to 102"]
    );

    await client.query(
      `INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES
      ($1, $2, CURRENT_DATE, $3)`,
      [102, 1000, "Transfer from 101"]
    );

    await client.query("COMMIT");
    console.log("Transaction completed successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
  } finally {
    await client.end();
  }
}

runTransfer();
