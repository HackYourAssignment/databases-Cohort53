import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
  port: 5432,
});

async function getPopulationRisky(name, code) {
  try {
    console.log("\n[Risky Function]");
    const result = await pool.query(
      `SELECT name, population FROM country WHERE Name = '${name}' AND code = '${code}'`
    );

    if (result.rows.length === 0) {
      throw new Error("Not found");
    }

    console.table(result.rows);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getPopulationSafe(name, code) {
  try {

    console.log("\n[Safe Function]");

    const query = `SELECT name, population FROM country WHERE Name = $1 AND code = $2`;
    const values = [name, code];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Not found");
    }

    console.table(result.rows);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function test() {
  try {
    const maliciousName = "' OR '1'='1";
    const maliciousCode = "' OR '1'='1";

    await getPopulationRisky(maliciousName, maliciousCode);
    await getPopulationSafe(maliciousName, maliciousCode);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

test();
