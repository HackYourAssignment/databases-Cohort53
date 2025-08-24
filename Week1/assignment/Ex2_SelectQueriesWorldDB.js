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
  SELECT name FROM public.country
  WHERE public.country.population > 8000000    
    `,
  "2. What are the names of countries that have 'land' in their names": `
  SELECT name FROM public.country
  WHERE public.country.name LIKE '%land%'   
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
        console.log(row.name);
      });
      // console.log(JSON.stringify(result.rows));
      // console.log(result.rows);
    }
  } catch (error) {
    console.error("Error quering database:", error);
  } finally {
    await client.end();
  }
}

queryDatabase();
