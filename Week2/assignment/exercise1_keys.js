import { setupDatabase } from './connectDatabase.js';

// Create authors table
  async function createAuthorsTable() {
  const client = await setupDatabase();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS authors (
        author_id SERIAL PRIMARY KEY,
        author_name VARCHAR(100),
        university VARCHAR(100),
        date_of_birth DATE,
        h_index INT,
        gender VARCHAR(10)
      );
    `);
    console.log('Table "authors" created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await client.end();
  }
}

// Add mentor column
  async function addMentorColumn() {
  const client = await setupDatabase();
  try {
    await client.query(`
      ALTER TABLE authors
      ADD COLUMN mentor INT REFERENCES authors(author_id);
    `);
    console.log('Column "mentor" added successfully!');
  } catch (error) {
    console.error('Error adding mentor column:', error);
  } finally {
    await client.end();
  }
}

export async function main1() {
  // Drop & recreate database for a fresh start
  const client1 = await setupDatabase(true);
  await client1.end();
  await createAuthorsTable();
  await addMentorColumn();
  console.log('3.1. Exercise 1: Keys completed successfully!');
}