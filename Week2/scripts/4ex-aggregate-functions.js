import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "db-assignment-w2",
});

async function runAggregateQueries() {
  try {
    await client.query(`
SELECT rp.paper_title, COUNT(ap.author_id) AS author_count
FROM research_papers rp
LEFT JOIN author_papers ap ON rp.paper_id = ap.paper_id
GROUP BY rp.paper_id, rp.paper_title;
  `);

    await client.query(`
      SELECT SUM(paper_count) AS total_papers_by_females
FROM (
  SELECT COUNT(ap.paper_id) AS paper_count
  FROM authors a
  JOIN author_papers ap ON a.author_id = ap.author_id
  WHERE a.gender = 'female'
  GROUP BY a.author_id) sub;
  `);

    await client.query(`
      SELECT university, AVG(h_index) AS avg_h_index
FROM authors
GROUP BY university;
  `);

    await client.query(`
      SELECT a.university, COUNT(ap.paper_id) AS total_papers
FROM authors a
LEFT JOIN author_papers ap ON a.author_id = ap.author_id
GROUP BY a.university;
  `);

    await client.query(`
      SELECT university, MIN(h_index) AS min_h_index, MAX(h_index) AS max_h_index
FROM authors
GROUP BY university;
  `);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

runAggregateQueries();
