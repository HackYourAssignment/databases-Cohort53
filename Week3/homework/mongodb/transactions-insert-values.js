import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "hyfuser",
  host: "localhost",
  database: "HYFBank",
  password: "hyfpassword",
  port: 5432,
});

async function insertSampleData() {
  try {
    // Insert accounts
    await pool.query(`
      INSERT INTO account (account_number, balance)
      VALUES
        (101, 5000),
        (102, 3000)
      ON CONFLICT (account_number) DO NOTHING;
    `);

    // Insert some initial data
    await pool.query(`
      INSERT INTO account_changes (account_number, amount, remark)
      VALUES
        (101, 0, 'Initial deposit'),
        (102, 0, 'Initial deposit')
    `);

    console.log("Data inserted successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

insertSampleData();
