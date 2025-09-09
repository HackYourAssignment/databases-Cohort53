import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "db-assignment-w2",
});

async function authorsWithMentor() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    await client.query(`
  CREATE TABLE IF NOT EXISTS authors (
  author_id SERIAL PRIMARY KEY,
  author_name VARCHAR(100),
  university VARCHAR(100),
  date_of_birth DATE,
  h_index INTEGER,
  gender VARCHAR(10)
    )`);

    await client.query(`
      ALTER TABLE authors
      ADD COLUMN mentor INTEGER,
      ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor) REFERENCES authors(author_id)
      `);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

authorsWithMentor();
