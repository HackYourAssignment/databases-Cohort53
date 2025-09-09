import pool from "./main.js";

export async function insertSampleData() {
  try {
    // Insert account 101
    const account101 = await pool.query(
      `INSERT INTO account(account_number, balance) VALUES($1, $2) RETURNING *`,
      [101, 5000]
    );

    // Insert account 102
    const account102 = await pool.query(
      `INSERT INTO account(account_number, balance) VALUES($1, $2) RETURNING *`,
      [102, 3000]
    );

    console.log("Accounts inserted:", account101.rows[0], account102.rows[0]);

    // Insert initial transactions
    await pool.query(
      `INSERT INTO account_changes(account_number, amount, remark)
       VALUES($1, $2, $3)`,
      [101, 1000, "Initial deposit"]
    );
    await pool.query(
      `INSERT INTO account_changes(account_number, amount,remark)
       VALUES($1, $2, $3)`,
      [102, 500, "Initial deposit"]
    );

    console.log("Initial transactions inserted successfully");
  } catch (error) {
    console.error("Error:", error);
  } 
}


