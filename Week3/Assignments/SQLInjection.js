function getPopulation(Country, name = "' OR '1'='1", code = "' OR '1'='1", cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM ${Country} WHERE Name = '${name}' and code = '${code}'`,
    [Country, name, code],
    function (err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error("Not found"));
      cb(null, result[0].name);
    }
  );
}
// the query becomes SELECT Population FROM Country WHERE Name = '' OR '1'='1' AND code = '' OR '1'='1';
// which is always true and returns the population of all countries
// to fix this we can use parameterized queries and whitelist for table names
function getPopulation(Country, name, code, cb) {
const allowedTables=['Country'];
if(!allowedTables.includes(Country)){
     throw new Error('Invalid table');
    }
  conn.query(
    `SELECT Population FROM ${Country} WHERE Name = $1 and code = $2`,
    [name, code],
    function (err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error("Not found"));
      cb(null, result[0].Population);
    }
  );
}