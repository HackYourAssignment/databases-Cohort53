const mysql = require("mysql2/promise");

async function insertValues() {
  const conn = await mysql.createConnection({ user: "root", database: "week3" });

  await conn.execute(`INSERT INTO account (account_number, balance) VALUES
    (101, 5000.00),
    (102, 3000.00)
    ON DUPLICATE KEY UPDATE balance=VALUES(balance)
  `);

  console.log("Sample data inserted!");
  await conn.end();
}

insertValues().catch(console.error);
