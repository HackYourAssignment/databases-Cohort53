require("dotenv").config();
const { Client } = require("pg");

const worldConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "world",
};

// Small helper to run a query and pretty-print up to 10 rows
async function q(db, label, sql, params = []) {
  const res = await db.query(sql, params);
  console.log(`\n=== ${label} ===`);
  console.table(res.rows.slice(0, 10));
  return res;
}

async function run() {
  let db; // keep a reference so we can close it in finally

  try {
    db = new Client(worldConfig);
    await db.connect();

    // 1) Countries with population > 8M
    await q(
      db,
      "Countries with population > 8M",
      `SELECT name
       FROM country
       WHERE population > 8000000
       ORDER BY population DESC;`
    );

    // 2) Countries that have "land" in their names
    await q(
      db,
      'Countries with "land" in name',
      `SELECT name
       FROM country
       WHERE name ILIKE '%land%'
       ORDER BY name;`
    );

    // 3) Cities with population between 500k and 1M
    await q(
      db,
      "Cities 500k..1M",
      `SELECT name, population
       FROM city
       WHERE population BETWEEN 500000 AND 1000000
       ORDER BY population DESC;`
    );

    // 4) Countries on the continent 'Europe'
    await q(
      db,
      "Countries in Europe",
      `SELECT name
       FROM country
       WHERE continent = 'Europe'
       ORDER BY name;`
    );

    // 5) Countries by surface area (desc)
    await q(
      db,
      "Countries by surface area (DESC)",
      `SELECT name, surfacearea
       FROM country
       ORDER BY surfacearea DESC;`
    );

    // 6) Names of all cities in the Netherlands
    await q(
      db,
      "Cities in the Netherlands",
      `SELECT c.name
       FROM city c
       JOIN country co ON c.countrycode = co.code
       WHERE co.name = 'Netherlands'
       ORDER BY c.name;`
    );

    // 7) Population of Rotterdam
    await q(
      db,
      "Population of Rotterdam",
      `SELECT c.population
       FROM city c
       JOIN country co ON c.countrycode = co.code
       WHERE co.name = 'Netherlands' AND c.name = 'Rotterdam';`
    );

    // 8) Top 10 countries by surface area
    await q(
      db,
      "Top 10 countries by surface area",
      `SELECT name, surfacearea
       FROM country
       ORDER BY surfacearea DESC
       LIMIT 10;`
    );

    // 9) Top 10 most populated cities
    await q(
      db,
      "Top 10 most populated cities",
      `SELECT name, population
       FROM city
       ORDER BY population DESC
       LIMIT 10;`
    );

    // 10) Estimated world population (sum of country populations)
    await q(
      db,
      "World population (sum of countries.population)",
      `SELECT SUM(population)::BIGINT AS world_population
       FROM country;`
    );

    console.log("\n Exercise 2: DONE");
  } catch (err) {
    console.error(" Exercise 2 failed:", err);
    // do not exit immediately; allow finally to close the connection
    process.exitCode = 1;
  } finally {
    // always close the connection
    if (db) {
      try {
        await db.end();
      } catch {}
    }
  }
}

run();
