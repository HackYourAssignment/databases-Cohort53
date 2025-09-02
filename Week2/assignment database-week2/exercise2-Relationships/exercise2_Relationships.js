import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "authors_db",
  port: 5432,
});

async function main() {
  try {
    

    await pool.query("DROP TABLE IF EXISTS authors_papers");
    await pool.query("DROP TABLE IF EXISTS research_Papers");
    console.log("Tables dropped successfully");

    const createResearchPapers = `
    CREATE TABLE research_Papers (
    paper_id SERIAL PRIMARY KEY,
    paper_title VARCHAR(50)NOT NULL,
    conference VARCHAR(100) NOT NULL,
    publish_date DATE
);
`;
    await pool.query(createResearchPapers);
    console.log("Table Successfully created");

    const createAuthorsPapers = `
    CREATE TABLE authors_papers (
    author_id INT,
     paper_id INT,
   PRIMARY KEY(author_id, paper_id),
   Foreign Key (author_id ) REFERENCES authors(author_id),
   Foreign Key (paper_id) REFERENCES research_Papers(paper_id)
);
`;
await pool.query(createAuthorsPapers);
console.log("Injection table Successfully created");



    
  } catch (error) {
    console.error("Error", error);
  } finally {
    await pool.end();
  }
}
main();
