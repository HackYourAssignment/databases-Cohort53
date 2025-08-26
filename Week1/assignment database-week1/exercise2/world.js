const { Pool } = require("pg");

const { createPool } = require("../db-config");
const pool = createPool("world");

 async function showData() {
  try {
    // 1️- Names of countries with population > 8 million
    const response = await pool.query(
      "SELECT name FROM country WHERE population > 8000000"
    );
    console.log("Countries with population > 8 million:");
    console.table(response.rows);

    // 2️- Names of countries that have "land" in their names
    const response1 = await pool.query(
      "SELECT name FROM country WHERE name LIKE '%land%'"
    );
    console.log('Countries with "land" in the name:');
    console.table(response1.rows);

    // 3️- Cities with population between 500,000 and 1 million
    const response2 = await pool.query(
      "SELECT name FROM city WHERE population BETWEEN 500000 AND 1000000"
    );
    console.log("Cities with population between 500,000 and 1 million:");
    console.table(response2.rows);

    // 4️- All countries in Europe
    const response3 = await pool.query(
      "SELECT name FROM country WHERE continent = 'Europe'"
    );
    console.log("Countries in Europe:");
    console.table(response3.rows);

    // 5️- All countries in descending order of surface area
    const response4 = await pool.query(
      "SELECT name, surfacearea FROM country ORDER BY surfacearea DESC"
    );
    console.log("Countries by descending surface area:");
    console.table(response4.rows);

    // 6️- All cities in the Netherlands
    const response5 = await pool.query(
      "SELECT name FROM city WHERE countrycode = 'NLD'"
    );
    console.log("Cities in the Netherlands:");
    console.table(response5.rows);

    // 7️- Population of Rotterdam
    const response6 = await pool.query(
      "SELECT name, population FROM city WHERE name = 'Rotterdam'"
    );
    console.log("Population of Rotterdam:");
    console.table(response6.rows);

    // 8️- Top 10 countries by surface area
    const response7 = await pool.query(
      "SELECT name, surfacearea FROM country ORDER BY surfacearea DESC LIMIT 10"
    );
    console.log("Top 10 countries by surface area:");
    console.table(response7.rows);

    // 9️- Top 10 most populated cities
    const response8 = await pool.query(
      "SELECT name, population FROM city ORDER BY population DESC LIMIT 10"
    );
    console.log("Top 10 most populated cities:");
    console.table(response8.rows);

    // 10- Total population of the world
    const response9 = await pool.query(
      "SELECT SUM(population) AS world_population FROM country"
    );
    console.log("Total population of the world:");
    console.table(response9.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

module.exports = showData;
