import { setup } from "./setup.js";
import { transfer } from "./transfer.js";
let clientMongo, account;
async function main() {
  try {
    ({ clientMongo, account } = await setup());
    const transactionDetails = {
      donator_account_number: 101,
      receiver_account_number: 102,
      amount: 1000,
      changed_date: new Date().toISOString().slice(0, 10), // 'YYYY-MM-DD'
      remark: `Transfer from 101 to 102`,
    };
    await transfer(clientMongo, account, transactionDetails);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await clientMongo.close();
    console.log("Connection to MongoDB closed");
  }
}

main();
