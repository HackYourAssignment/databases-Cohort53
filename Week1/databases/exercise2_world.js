import { connectDB } from "./connectDatabase.js";

async function runQueries() {
  const client = await connectDB("world");

  try {
    const q1 = await client.query(
      `SELECT name FROM country WHERE population > 8000000;`
    );
    console.log("1. Countries > 8M:", q1.rows);

    const q2 = await client.query(
      `SELECT name FROM country WHERE name ILIKE '%land%';`
    );
    console.log("2. Countries with 'land':", q2.rows);

    const q3 = await client.query(
      `SELECT name FROM city WHERE population BETWEEN 500000 AND 1000000;`
    );
    console.log("3. Cities 500k–1M:", q3.rows);

    const q4 = await client.query(
      `SELECT name FROM country WHERE continent = 'Europe';`
    );
    console.log("4. European countries:", q4.rows);

    const q5 = await client.query(
      `SELECT name FROM country ORDER BY surfacearea DESC;`
    );
    console.log("5. Countries by surface area DESC:", q5.rows);

    const q6 = await client.query(
      `SELECT name FROM city WHERE countrycode = 'NLD';`
    );
    console.log("6. Cities in Netherlands:", q6.rows);

    const q7 = await client.query(
      `SELECT population FROM city WHERE name = 'Rotterdam';`
    );
    console.log("7. Population of Rotterdam:", q7.rows);

    const q8 = await client.query(`
      SELECT name FROM country ORDER BY surfacearea DESC LIMIT 10;
    `);
    console.log("8. Top 10 countries by surface area:", q8.rows);

    const q9 = await client.query(`
      SELECT name FROM city ORDER BY population DESC LIMIT 10;
    `);
    console.log("9. Top 10 most populated cities:", q9.rows);

    const q10 = await client.query(
      `SELECT SUM(population) AS world_population FROM country;`
    );
    console.log("10. World population:", q10.rows[0].world_population);
  } catch (err) {
    console.error("Query error:", err);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

runQueries();
