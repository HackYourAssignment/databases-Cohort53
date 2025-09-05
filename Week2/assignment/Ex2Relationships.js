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

async function createTables(client) {
    const CREATE_RESEARCH_PAPERS_TABLE = `
    CREATE TABLE IF NOT EXISTS research_papers (
      paper_id SERIAL PRIMARY KEY,
      paper_title VARCHAR(50) NOT NULL,
      conference VARCHAR(50),
      publish_date DATE
    )`;

  const CREATE_PAPER_AUTHORS_TABLE = `
    CREATE TABLE IF NOT EXISTS paper_authors (
      paper_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      PRIMARY KEY (paper_id, author_id),
      CONSTRAINT fk_paper
        FOREIGN KEY (paper_id) 
        REFERENCES research_papers(paper_id) 
        ON DELETE CASCADE,
      CONSTRAINT fk_author
        FOREIGN KEY (author_id) 
        REFERENCES authors(author_id) 
        ON DELETE CASCADE
    )`;

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create tables
    await client.query(CREATE_RESEARCH_PAPERS_TABLE);
    await client.query(CREATE_PAPER_AUTHORS_TABLE);
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await client.end();
  }
}
createTables(client);
