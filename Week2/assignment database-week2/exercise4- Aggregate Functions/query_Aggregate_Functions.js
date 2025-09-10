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
   const reuslt=  await pool.query("SELECT * FROM authors")
   console.log("\n=== AUTHORS ===");
   console.table(reuslt.rows)
  
    const reuslt1= await pool.query("SELECT * FROM research_Papers")
    console.log("\n=== RESEARCH PAPERS ===");
    console.table(reuslt1.rows)
  
    const reuslt2= await pool.query("SELECT * FROM authors_papers")
    console.log("\n=== AUTHORS PAPERS ===");
    console.table(reuslt2.rows)
   
    const res = await pool.query(`
        SELECT 
        research_papers.paper_title AS A_research_paper,
        COUNT(authors_papers.author_id) AS number_of_authors
        FROM research_papers
        LEFT JOIN authors_papers ON research_papers.paper_id = authors_papers.paper_id
        GROUP BY research_papers.paper_id, research_papers.paper_title
        ORDER BY research_papers.paper_id
      `);
    console.table(res.rows);

    const res1 = await pool.query(`
        SELECT 
          COUNT(authors_papers.paper_id) AS total_papers_female_authors
        FROM authors
        JOIN authors_papers ON authors.author_id = authors_papers.author_id
        WHERE authors.gender = 'Female'
      `);
    console.table(res1.rows);

    const res2 = await pool.query(`
        SELECT 
          authors.university,
          AVG(authors.h_index) AS avg_h_index
        FROM authors
        GROUP BY authors.university
        ORDER BY authors.university
      `);
    console.table(res2.rows);

    const res3 = await pool.query(`
        SELECT 
          authors.university,
          COUNT(authors_papers.paper_id) AS total_papers
        FROM authors
        LEFT JOIN authors_papers ON authors.author_id = authors_papers.author_id
        GROUP BY authors.university
        ORDER BY authors.university
      `);

    console.table(res3.rows);

    const res4 = await pool.query(`
    SELECT 
      authors.university,
      MIN(authors.h_index) AS min_h_index,
      MAX(authors.h_index) AS max_h_index
    FROM authors
    GROUP BY authors.university
    ORDER BY authors.university
  `);
    console.table(res4.rows);
  } catch (error) {
    console.error("Error", error);
  } finally {
    await pool.end();
  }
}
main();
