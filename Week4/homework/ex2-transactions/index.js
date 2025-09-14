import { setup } from "./setup.js";
let clientMongo, account, accountChanges;
async function main() {
  try {
    ({ clientMongo, account, accountChanges } = await setup());
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await clientMongo.close();
    console.log("Connection to MongoDB closed");
  }
}

main();
