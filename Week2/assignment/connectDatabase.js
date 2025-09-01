import pkg from 'pg';
const { Client } = pkg;

export async function setupDatabase(dropAndCreate = false) {
  // Connect to default database
  const defaultClient = new Client({
    user: 'hyfuser',
    host: 'localhost',
    database: 'postgres',
    password: 'hyfpassword',
    port: 5432,
  });

  await defaultClient.connect();
  console.log('Connected to default database.');

  if (dropAndCreate) {
    await defaultClient.query(`DROP DATABASE IF EXISTS research_db;`);
    await defaultClient.query(`CREATE DATABASE research_db;`);
    console.log('Database "research_db" created.');
  }

  await defaultClient.end();

  // Connect to research_db
  const client = new Client({
    user: 'hyfuser',
    host: 'localhost',
    database: 'research_db',
    password: 'hyfpassword',
    port: 5432,
  });

  await client.connect();
  console.log('Connected to "research_db".');
  return client;
}