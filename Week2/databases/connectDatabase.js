import pkg from 'pg';
const { Client } = pkg;


export async function connectDB(database = 'postgres') {
  const client = new Client({
    user: 'hyfuser',
    host: 'localhost',
    database,
    password: 'hyfpassword',
    port: 5432,
  });

  try {
    await client.connect();
    console.log(`Connected to database: ${database}`);
    return client;
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}
