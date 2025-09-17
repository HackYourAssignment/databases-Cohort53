module.exports = async function setupAccounts(collection) {
  await collection.deleteMany({});
  await collection.insertMany([
    {
      account_number: 101,
      balance: 5000,
      account_changes: [],
    },
    {
      account_number: 102,
      balance: 3000,
      account_changes: [],
    },
  ]);
};
