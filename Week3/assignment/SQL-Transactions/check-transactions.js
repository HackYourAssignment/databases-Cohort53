import pool from "./main.js";

export async function showChanges() {
  try {
    //  Show current account balances
    const accounts = await pool.query(
      `SELECT * FROM account ORDER BY account_number`
    );
    console.log("Current account balances:");
    console.table(
      accounts.rows.map((acc) => ({
        "Account": acc.account_number,
        Balance: acc.balance,
      }))
    );

    // 2️ Show all transactions
    const transactions = await pool.query(
      `SELECT * FROM account_changes ORDER BY change_number`
    );
    console.log("\nAll transactions:");
    console.table(
      transactions.rows.map((trx) => {
        const dateObj = new Date(trx.changed_date);
        const localDate =
          dateObj.getFullYear() +
          "-" +
          String(dateObj.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(dateObj.getDate()).padStart(2, "0") +
          " " +
          String(dateObj.getHours()).padStart(2, "0") +
          ":" +
          String(dateObj.getMinutes()).padStart(2, "0") +
          ":" +
          String(dateObj.getSeconds()).padStart(2, "0");

        return {
          "Change": trx.change_number,
          "Account": trx.account_number,
          Amount: trx.amount,
          Date: localDate,
          Remark: trx.remark,
        };
      })
    );
  } catch (error) {
    console.error("Error:", error);
  }
}
