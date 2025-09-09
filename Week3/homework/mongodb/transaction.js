import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "hyfuser",
  host: "localhost",
  database: "HYFBank",
  password: "hyfpassword",
  port: 5432,
});

async function transferAmount() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const transferAmount = 1000;

    // Deduct from account 101
    await client.query(
      "UPDATE account SET balance = balance - $1::NUMERIC WHERE account_number = $2",
      [transferAmount, 101]
    );

    // Add to account 102
    await client.query(
      "UPDATE account SET balance = balance + $1::NUMERIC WHERE account_number = $2",
      [transferAmount, 102]
    );

    // Log changes in account_changes table
    await client.query(
      `INSERT INTO account_changes (account_number, amount, remark)
       VALUES
       ($1, -$2::NUMERIC, 'Transfer to account 102'),
       ($3, $2::NUMERIC, 'Received from account 101')`,
      [101, transferAmount, 102]
    );

    await client.query("COMMIT");

    console.log(
      `Transferred ${transferAmount} from account 101 to 102 successfully!`
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Transaction failed, rolled back.", err);
  } finally {
    client.release();
    await pool.end();
  }
}

transferAmount();
