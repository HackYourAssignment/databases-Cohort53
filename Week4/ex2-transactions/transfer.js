const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "databaseWeek4";
const collectionName = "accounts";

async function transfer(fromAccount, toAccount, amount, remark) {
  const client = new MongoClient(url);
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Get the accounts
      const fromAcc = await collection.findOne(
        { account_number: fromAccount },
        { session }
      );
      const toAcc = await collection.findOne(
        { account_number: toAccount },
        { session }
      );

      if (!fromAcc || !toAcc) {
        throw new Error("One or both accounts not found");
      }
      if (fromAcc.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Get the latest change_number
      const fromChangeNumber = fromAcc.account_changes.length
        ? Math.max(...fromAcc.account_changes.map((c) => c.change_number)) + 1
        : 1;
      const toChangeNumber = toAcc.account_changes.length
        ? Math.max(...toAcc.account_changes.map((c) => c.change_number)) + 1
        : 1;

      // Update from account
      await collection.updateOne(
        { account_number: fromAccount },
        {
          $inc: { balance: -amount },
          $push: {
            account_changes: {
              change_number: fromChangeNumber,
              amount: -amount,
              changed_date: new Date(),
              remark,
            },
          },
        },
        { session }
      );

      // Update to account
      await collection.updateOne(
        { account_number: toAccount },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: toChangeNumber,
              amount: amount,
              changed_date: new Date(),
              remark,
            },
          },
        },
        { session }
      );

      console.log(`Transferred ${amount} from ${fromAccount} to ${toAccount}`);
    });
  } catch (err) {
    console.error("Error in transaction:", err);
    throw err;
  } finally {
    await session.endSession();
    await client.close();
  }
}

module.exports = { transfer };

// Test the transfer
async function main() {
  await transfer(101, 102, 1000, "Test transfer");
}

main();
