import { Pool } from "pg";
import { createTables } from "./transactions-create-tables.js";
import { insertSampleData } from "./transactions-insert-values.js";
import { transferAmount } from "./transaction.js";
import { showChanges } from "./check-transactions.js";


const pool = new Pool({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "transactiondb",
  port: 5432,
});
export default pool

async function main(){
  try{
    await createTables();
    await insertSampleData();
    await transferAmount(101, 102, 1000);
    await showChanges();

  }catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}
main()