const mysql = require("mysql2/promise");

async function transferFunds() {
  const conn = await mysql.createConnection({ user: "root", database: "week3" });

  try {
    await conn.beginTransaction();

    // Deduct from account 101
    await conn.execute(`UPDATE account SET balance = balance - 1000 WHERE account_number = 101`);
    await conn.execute(
      `INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)`,
      [101, -1000, "Transfer to 102"]
    );

    // Add to account 102
    await conn.execute(`UPDATE account SET balance = balance + 1000 WHERE account_number = 102`);
    await conn.execute(
      `INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)`,
      [102, 1000, "Transfer from 101"]
    );

    await conn.commit();
    console.log("Transaction successful!");
  } catch (err) {
    await conn.rollback();
    console.error("Transaction failed:", err);
  } finally {
    await conn.end();
  }
}

transferFunds();
