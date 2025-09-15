import { client, transactionsCollection } from "./db.js";

export async function transferMoney(fromAccount, toAccount, amount) {
  const sender = await transactionsCollection.findOne({
    account_number: fromAccount,
  });
  const receiver = await transactionsCollection.findOne({
    account_number: toAccount,
  });

  if (!sender || !receiver)
    throw new Error("One of the accounts does not exist");
  if (sender.balance < amount) throw new Error("Insufficient funds");

  const senderChangeNumber =
    (sender.account_changes.at(-1)?.change_number ?? 0) + 1;
  const receiverChangeNumber =
    (receiver.account_changes.at(-1)?.change_number ?? 0) + 1;

  const remark = `Transferred ${amount} from account ${fromAccount} to account ${toAccount}`;

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      await transactionsCollection.updateOne(
        { account_number: fromAccount },
        {
          $inc: { balance: -amount },
          $push: {
            account_changes: {
              change_number: senderChangeNumber,
              amount: -amount,
              changed_date: new Date(),
              remark,
            },
          },
        },
        { session }
      );

      await transactionsCollection.updateOne(
        { account_number: toAccount },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: receiverChangeNumber,
              amount: amount,
              changed_date: new Date(),
              remark,
            },
          },
        },
        { session }
      );
    });

    console.log(remark);
  } catch (error) {
    console.error(" Transaction failed:", error.message);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
}
