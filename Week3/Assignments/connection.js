const { Client } = require('pg');

const client = new Client({
    user: 'hyfuser',
    host: 'localhost',
    database: 'FinanceDB',
    password: 'hyfpassword',
    port: 5432,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;
