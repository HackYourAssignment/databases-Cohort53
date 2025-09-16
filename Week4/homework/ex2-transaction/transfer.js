const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const dbName = "financeDB";
const client = new MongoClient(url);

async function transferAmount(client, fromAccount, toAccount, amount, remark) {
  const session = client.startSession();
  const transactionOptions = {
    readPreference: { mode: "primary" },
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    await session.withTransaction(async () => {
      const db = client.db(dbName);
      const accounts = db.collection("accounts");

      const fromAcc = await accounts.findOne(
        { account_number: fromAccount },
        { session }
      );
      const toAcc = await accounts.findOne(
        { account_number: toAccount },
        { session }
      );

      if (!fromAcc || !toAcc) {
        throw new Error("Account not found");
      }
      if (fromAcc.balance < amount) {
        throw new Error(`Insufficient funds in account ${fromAccount}`);
      }

      await accounts.updateOne(
        { account_number: fromAccount },
        {
          $inc: { balance: -amount },
          $push: {
            account_changes: {
              change_number: fromAcc.account_changes.length + 1,
              change_amount: -amount,
              change_date: new Date(),
              remark,
            },
          },
        },
        { session }
      );

      await accounts.updateOne(
        { account_number: toAccount },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: toAcc.account_changes.length + 1,
              change_amount: amount,
              change_date: new Date(),
              remark,
            },
          },
        },
        { session }
      );
    }, transactionOptions);

    console.log("Transaction committed");
  } catch (err) {
    console.error("Transaction aborted", err.message);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
}
await transferAmount(client, 1, 2, 1000, "Rent payment");
