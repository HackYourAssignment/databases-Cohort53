import { Client } from "pg";

// Database connection configuration
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
  port: 5432,
};

const client = new Client(config);

const nameQueries = {
  "1. What are the names of countries with population greater than 8 million?": `
  SELECT name, population FROM country
  WHERE population > 8000000
    `,
  "2. What are the names of countries that have 'land' in their names": `
  SELECT name FROM country
  WHERE name LIKE '%land%'   
    `,
  "3. What are the names of the cities with population in between 500,000 and 1 million?": `
  SELECT name, population FROM city
  WHERE population > 500000 AND population < 1000000
    `,
  "4. What's the name of all the countries on the continent 'Europe'?": `
  SELECT name, continent FROM country
  WHERE continent = 'Europe'
    `,
  "5. List all the countries in the descending order of their surface areas.": `
  SELECT name, surfacearea FROM country
  ORDER BY surfacearea DESC
    `,
  "6. What are the names of all the cities in the Netherlands?": `
  SELECT name, countrycode FROM city
  WHERE countrycode = 'NLD'
    `,
  "7. What is the population of Rotterdam?": `
  SELECT name, population FROM city
  WHERE name = 'Rotterdam'
    `,
  "8. What's the top 10 countries by Surface Area?": `
  SELECT name, surfacearea FROM country
  ORDER BY surfacearea DESC
  LIMIT 10
    `,
  "9. What's the top 10 most populated cities?": `
  SELECT name, population FROM city
  ORDER BY population DESC
  LIMIT 10
    `,
  "10. What is the population number of the world?": `
  SELECT SUM(population) FROM country
    `,
};

async function queryDatabase() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Execute nameQueries
    console.log("Queries that return names of places");
    for (const [key, value] of Object.entries(nameQueries)) {
      const result = await client.query(value);
      console.log("\n", `Query ${key}:`);
      result.rows.forEach((row) => {
        console.log(
          Object.values(row)
            .join(", ")
            .replace(/.[0]+$/, "")
        );
      });
    }
  } catch (error) {
    console.error("Error quering database:", error);
  } finally {
    await client.end();
  }
}

queryDatabase();
