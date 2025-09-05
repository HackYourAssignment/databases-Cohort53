import { Client } from "pg";

// Database connection configuration
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "DBassignmentW2",
  port: 5432,
};

const client = new Client(config);

async function seedDatabase(client) {
  const CREATE_GENDER_TYPE = `
    CREATE TYPE GENDER AS ENUM ('Male', 'Female', 'X');
  `;

  const CREATE_AUTHORS_TABLE = `
    CREATE TABLE IF NOT EXISTS authors (
      author_id SERIAL PRIMARY KEY,
      author_name VARCHAR(50) NOT NULL,
      university VARCHAR(50),
      date_of_birth DATE,
      h_index SMALLINT,
      gender GENDER
    )`;

  const ALTER_AUTHORS_TABLE = `
    ALTER TABLE authors
    ADD COLUMN IF NOT EXISTS mentor INTEGER,
    ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor) REFERENCES authors(author_id) ON DELETE CASCADE
    `;

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create types and tables
    await client.query(CREATE_GENDER_TYPE);
    await client.query(CREATE_AUTHORS_TABLE);
    await client.query(ALTER_AUTHORS_TABLE);
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await client.end();
  }
}

seedDatabase(client);
