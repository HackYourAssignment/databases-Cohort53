const { Pool } = require('pg')

 async function createDatabase(dbName){
const pool = new Pool({
    user: 'hyfuser',
    host: 'localhost',
    database: 'postgres',
    password: 'hyfpassword',
    port: 5432,
})
try{
    await pool.query(`CREATE DATABASE ${dbName}`)
    console.log(`Databse ${dbName} has been seccessfully ctreated`)
} catch(error){
    console.error(`Error creating databse:${error}`)
} finally{
    await pool.end()
}
}

module.exports = createDatabase
