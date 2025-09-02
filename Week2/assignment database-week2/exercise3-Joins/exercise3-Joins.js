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
    const reuslt = await pool.query(`SELECT 
    authors.author_name AS author,
    mentors.author_name AS mentor
    FROM 
    authors
    LEFT JOIN 
    authors AS mentors
    ON 
    authors.mentor = mentors.author_id;
    `);
    console.log("Authors and their mentors:");
    console.table(reuslt.rows);

    const reuslt2 = await pool.query(`SELECT 
    authors.*, 
    research_Papers.paper_title
    FROM 
    authors
    LEFT JOIN 
    authors_papers
    ON 
    authors.author_id = authors_papers.author_id
    LEFT JOIN
    research_Papers
    ON
    authors_papers.paper_id = research_Papers.paper_id;
    `);
    console.log("Authors and their papers:");
    console.table(reuslt2.rows);

  } catch (error) {
    console.error("Error", error);
  } finally {
    await pool.end();
  }
}
main();
