import pkg from "pg";
const { Client } = pkg;
const client1 = new Client({
  user: "postgres", // change if needed
  host: "localhost",
  database: "testdb", // change if needed
  password: "yourpassword", // change if needed
  port: 5432,
});
const client2 = new Client({
  user: "postgres",
  host: "localhost",
  database: "testdb",
  password: "yourpassword",
  port: 5432,
});
async function run() {
  await client1.connect();
  await client2.connect();
  try {
    // Transaction A (withdraw 100)
    const txA = async () => {
      await client1.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      const res = await client1.query("SELECT balance FROM accounts WHERE account_id = 1");
      console.log("TxA sees balance:", res.rows[0].balance);
      await new Promise(r => setTimeout(r, 2000)); // simulate delay
      await client1.query("UPDATE accounts SET balance = balance - 100 WHERE account_id = 1");
      await client1.query("COMMIT");
      console.log("TxA committed");
    };
    // Transaction B (withdraw 100 at the same time)
    const txB = async () => {
      await client2.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      const res = await client2.query("SELECT balance FROM accounts WHERE account_id = 1");
      console.log("TxB sees balance:", res.rows[0].balance);
      await new Promise(r => setTimeout(r, 1000)); // simulate overlap
      await client2.query("UPDATE accounts SET balance = balance - 100 WHERE account_id = 1");
      await client2.query("COMMIT");
      console.log("TxB committed");
    };
    // Run both "at the same time"
    await Promise.allSettled([txA(), txB()]);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client1.end();
    await client2.end();
  }
}
run();