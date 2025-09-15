export async function transfer(clientMongo, account, transactionDetails) {
  const {
    donator_account_number,
    receiver_account_number,
    amount,
    changed_date,
    remark,
  } = transactionDetails;
  const session = clientMongo.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };
  try {
    await session.withTransaction(async () => {
      await account.updateOne(
        { account_number: donator_account_number },
        {
          $inc: { balance: -amount },
          $push: { account_changes: { amount: -amount, changed_date, remark } },
        },
        { session }
      );
      await account.updateOne(
        { account_number: receiver_account_number },
        { $inc: { balance: amount } },
        {
          $push: { account_changes: { amount: amount, changed_date, remark } },
        },
        { session }
      );
    }, transactionOptions);
    console.log("Transaction committed.");
  } catch (error) {
    console.log("Transaction aborted.", error);
  } finally {
    await session.endSession();
    console.log("Transaction completed!");
  }
}
