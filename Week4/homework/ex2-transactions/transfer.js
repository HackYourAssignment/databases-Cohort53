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
      // Deduct from donator
      await account.updateOne(
        { account_number: donator_account_number },
        { $inc: { balance: -amount } },
        { session }
      );

      // Add to receiver
      await account.updateOne(
        { account_number: receiver_account_number },
        { $inc: { balance: amount } },
        { session }
      );

      // Log donator change
      await clientMongo.db().collection("account_changes").insertOne(
        {
          account_number: donator_account_number,
          amount: -amount,
          changed_date,
          remark,
        },
        { session }
      );

      // Log receiver change
      await clientMongo.db().collection("account_changes").insertOne(
        {
          account_number: receiver_account_number,
          amount,
          changed_date,
          remark,
        },
        { session }
      );
    }, transactionOptions);
    console.log("Transaction committed.");
  } catch (e) {
    console.log("Transaction aborted.", e);
  } finally {
    await session.endSession();
    console.log("Transaction completed!");
  }
}
