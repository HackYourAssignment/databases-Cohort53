import { Client } from "pg";
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "transactions_week3",
  port: 5432,
};
const client = new Client(config);

async function seedDatabase(client) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    const donator_account_number = 101;
    const receiver_account_number = 102;
    const amount = 1000;
    const changed_date = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const remark = `Transfer from 101 to 102`;

    await client.query("BEGIN");
    await client.query(
      "UPDATE ACCOUNT SET balance = balance - $1 WHERE account_number = $2",
      [amount, donator_account_number]
    );
    await client.query(
      "UPDATE ACCOUNT SET balance = balance + $1 WHERE account_number = $2",
      [amount, receiver_account_number]
    );
    await client.query(
      "INSERT INTO account_changes(account_number, amount, changed_date, remark) VALUES($1, $2, $3, $4)",
      [donator_account_number, -amount, changed_date, remark]
    );
    await client.query(
      "INSERT INTO account_changes(account_number, amount, changed_date, remark) VALUES($1, $2, $3, $4)",
      [receiver_account_number, amount, changed_date, remark]
    );
    await client.query("COMMIT");
    console.log("Transaction completed!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase(client);
