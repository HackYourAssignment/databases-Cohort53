const { Pool } = require("pg")

 function createPool(dbName){
return new Pool ({
    user: 'hyfuser',
    host: 'localhost',
    database: dbName,
    password: 'hyfpassword',
    port: 5432,
})
}

module.exports = {createPool}