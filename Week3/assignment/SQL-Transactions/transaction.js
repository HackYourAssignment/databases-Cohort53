import pool from "./main.js";

export async function transferAmount(senderAccount, receiverAccount, amount) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // start transaction

    // Deduct from sender
    const deduct = await client.query(
      `UPDATE account
       SET balance = balance - $1
       WHERE account_number = $2
       RETURNING *`,
      [amount, senderAccount]
    );

    if (deduct.rows.length === 0) throw new Error("Sender account not found");

    // Add to receiver
    const add = await client.query(
      `UPDATE account
       SET balance = balance + $1
       WHERE account_number = $2
       RETURNING *`,
      [amount, receiverAccount]
    );

    if (add.rows.length === 0) throw new Error("Receiver account not found");

    // Log sender transaction
    await client.query(
      `INSERT INTO account_changes(account_number, amount, remark)
       VALUES($1, $2, $3)`,
      [senderAccount, -amount, `Transfer to account ${receiverAccount}`]
    );

    // Log receiver transaction
    await client.query(
      `INSERT INTO account_changes(account_number, amount, remark)
       VALUES($1, $2, $3)`,
      [receiverAccount, amount, `Received from account ${senderAccount}`]
    );

    await client.query("COMMIT"); // commit transaction
    console.log(`Transfer of ${amount} from account ${senderAccount} to ${receiverAccount} completed successfully`);
  } catch (error) {
    await client.query("ROLLBACK"); // rollback on error
    console.error("Transaction failed:", error.message);
  } finally{
    client.release();
  }
}


