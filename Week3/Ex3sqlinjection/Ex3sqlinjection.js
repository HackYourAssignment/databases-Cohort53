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
    console.log("Population:", population);
  }
  conn.end();
});
