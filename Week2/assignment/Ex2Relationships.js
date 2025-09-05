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
  const CREATE_RESEARCH_PAPERS_TABLE = `
    CREATE TABLE IF NOT EXISTS research_papers (
      paper_id SERIAL PRIMARY KEY,
      paper_title VARCHAR(50) NOT NULL,
      conference VARCHAR(50),
      publish_date DATE
    )`;

  const ALTER_RESEARCH_PAPERS_TABLE = `
    ALTER TABLE research_papers
    ADD COLUMN IF NOT EXISTS author_id SMALLINT,
    ADD CONSTRAINT fk_author_id
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
    `;

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create tables
    await client.query(CREATE_RESEARCH_PAPERS_TABLE);
    await client.query(ALTER_RESEARCH_PAPERS_TABLE);
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await client.end();
  }
}

seedDatabase(client);
