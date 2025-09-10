import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "db-assignment-w2",
});

async function runJoinQueries() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    await client.query(`
      SELECT a.author_name AS author, m.author_name AS mentor
      FROM authors a
      LEFT JOIN authors m ON a.mentor = m.author_id;
      `);

    await client.query(`
      SELECT a.*, rp.paper_title
FROM authors a
LEFT JOIN author_papers ap ON a.author_id = ap.author_id
LEFT JOIN research_papers rp ON ap.paper_id = rp.paper_id;
      
      `);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

runJoinQueries();
