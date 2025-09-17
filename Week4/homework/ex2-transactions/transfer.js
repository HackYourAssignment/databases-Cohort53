module.exports = async function transfer(
  collection,
  fromAcc,
  toAcc,
  amount,
  remark
) {
  const fromAccount = await collection.findOne({ account_number: fromAcc });
  const toAccount = await collection.findOne({ account_number: toAcc });

  if (!fromAccount || !toAccount) {
    throw new Error("One of the accounts does not exist");
  }

  if (fromAccount.balance < amount) {
    throw new Error("Insufficient funds");
  }

  const fromChanges = fromAccount.account_changes || [];
  const toChanges = toAccount.account_changes || [];

  await collection.updateOne(
    { account_number: fromAcc },
    {
      $inc: { balance: -amount },
      $push: {
        account_changes: {
          change_number: fromChanges.length + 1,
          amount: -amount,
          changed_date: new Date(),
          remark,
        },
      },
    }
  );

  await collection.updateOne(
    { account_number: toAcc },
    {
      $inc: { balance: amount },
      $push: {
        account_changes: {
          change_number: toChanges.length + 1,
          amount: amount,
          changed_date: new Date(),
          remark,
        },
      },
    }
  );
};
