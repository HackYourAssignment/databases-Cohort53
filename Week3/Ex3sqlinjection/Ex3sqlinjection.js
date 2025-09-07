import { Client } from "pg";
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
  port: 5432,
};
const conn = new Client(config);
await conn.connect();
console.log("Connected to PostgreSQL database!");

function getPopulation(Country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM ${Country} WHERE Name = '${name}' and code = '${code}'`,
    function (err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error("Not found"));
      cb(null, result.rows[0].population);
    }
  );
}

getPopulation("country", "Netherlands", "NLD", function (err, population) {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Netherland's population (the regular query):", population);
  }
});

// The resulting query becomes: SELECT Population FROM country WHERE Name = = '' OR 1=1 --' and code = '' OR 1=1 --'
// Since 1=1 is always true, this condition matches all rows in the country table. However, because the code only retrieves the first row from the result set, it returns only the population of the first country in the table.
getPopulation(
  "country",
  "' OR 1=1 --",
  "' OR 1=1 --",
  function (err, population) {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("the hacker's query):", population);
    }
    conn.end();
  }
);
