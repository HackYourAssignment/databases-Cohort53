import { connectToDatabase } from "./connectDatabase.js";

// Function to transfer amount between two accounts with transaction handling
export async function transfer(fromAccount, toAccount, amount, remark) {
  // Connect to the database and get the accounts collection
  const { db, client } = await connectToDatabase("databaseWeek4");
  // Get the accounts collection
  const accounts = db.collection("accounts");
  // Start a client session for transaction
  const session = client.startSession();

  // Start a transaction
  try {
    session.startTransaction();

    // Fetch both accounts
    // Use Promise.all to fetch them in parallel
    const [from, to] = await Promise.all([
      accounts.findOne({ account_number: fromAccount }, { session }),
      accounts.findOne({ account_number: toAccount }, { session }),
    ]);
    // Validate accounts and balance
    if (!from || !to) throw new Error("One or both accounts not found.");
    if (from.balance < amount) throw new Error("Insufficient funds.");

    // Prepare change_number
    // Use optional chaining and nullish coalescing to handle empty account_changes
    const fromChangeNum = (from.account_changes.at(-1)?.change_number || 0) + 1;
    const toChangeNum = (to.account_changes.at(-1)?.change_number || 0) + 1;

    // Perform updates
    // Use Promise.all to perform updates in parallel
    await Promise.all([
      accounts.updateOne(
        { account_number: fromAccount },
        {
          $inc: { balance: -amount },
          $push: {
            account_changes: {
              change_number: fromChangeNum,
              amount: -amount,
              changed_date: new Date(),
              remark: `Transfer to ${toAccount}: ${remark}`,
            },
          },
        },
        { session }
      ),
      // Update the recipient account
      accounts.updateOne(
        { account_number: toAccount },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: toChangeNum,
              amount: amount,
              changed_date: new Date(),
              remark: `Transfer from ${fromAccount}: ${remark}`,
            },
          },
        },
        { session }
      ),
    ]);
    // Commit the transaction
    await session.commitTransaction();
    console.log(
      `✅ Transferred ${amount} from ${fromAccount} to ${toAccount}.`
    );
  } catch (err) {
    // Abort the transaction on error
    await session.abortTransaction();
    console.error("❌ Transfer failed:", err.message);
    throw err; // Re-throw the error after aborting the transaction
  } finally {
    // End the session
    await session.endSession();
  }
}
