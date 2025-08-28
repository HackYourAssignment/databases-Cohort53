import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "world",
});

async function runWorldQueries() {
  try {
    await client.connect();
    console.log("Connected to PostgressQL!");

    await client.query(`
      SELECT country.name FROM country
WHERE country.population > 8000000
      `);

    await client.query(`
      SELECT country.name FROM country
      WHERE country.name LIKE '%land%'
      `);

    await client.query(`
      SELECT city.name FROM city
      WHERE city.population >= 500000 AND city.population <= 1000000
      `);

    await client.query(`
      SELECT country.name FROM country
      WHERE country.continent = 'Europe'
      `);

    await client.query(`
      SELECT * FROM country ORDER BY
       surfacearea DESC
      `);

    await client.query(`
   SELECT city.name
   FROM city
   JOIN country ON city.countrycode = country.code
   WHERE country.name = 'Netherlands'
      `);

    await client.query(`
      SELECT population
      FROM city
      WHERE name = 'Rotterdam'
      `);

    await client.query(`
      SELECT name, surfacearea
      FROM country
      ORDER BY
       surfacearea DESC
       LIMIT 10
      `);

    await client.query(`
      SELECT name, population
      FROM city
      ORDER BY population DESC
      LIMIT 10
      `);

    await client.query(`
      SELECT SUM(population) AS world_population
      FROM country
      `);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

runWorldQueries();
