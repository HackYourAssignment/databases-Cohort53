import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "hyf_db",
  password: "your_password",
  port: 5432,
});

async function main() {
  await client.connect();

  const q1 = await client.query(`
    SELECT rp.paper_title, COUNT(ap.author_id) AS author_count
    FROM research_papers rp
    LEFT JOIN author_papers ap ON rp.paper_id = ap.paper_id
    GROUP BY rp.paper_title;
  `);
  console.table(q1.rows);

  const q2 = await client.query(`
    SELECT SUM(cnt) AS female_paper_count FROM (
      SELECT COUNT(ap.paper_id) AS cnt
      FROM authors a
      JOIN author_papers ap ON a.author_id = ap.author_id
      WHERE a.gender = 'Female'
      GROUP BY a.author_id
    ) sub;
  `);
  console.table(q2.rows);

  const q3 = await client.query(`
    SELECT university, AVG(h_index) AS avg_hindex
    FROM authors
    GROUP BY university;
  `);
  console.table(q3.rows);

  const q4 = await client.query(`
    SELECT a.university, COUNT(ap.paper_id) AS paper_count
    FROM authors a
    LEFT JOIN author_papers ap ON a.author_id = ap.author_id
    GROUP BY a.university;
  `);
  console.table(q4.rows);

  const q5 = await client.query(`
    SELECT university, MIN(h_index) AS min_hindex, MAX(h_index) AS max_hindex
    FROM authors
    GROUP BY university;
  `);
  console.table(q5.rows);

  await client.end();
}

main().catch(console.error);
