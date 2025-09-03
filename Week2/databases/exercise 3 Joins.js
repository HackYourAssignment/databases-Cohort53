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

  const mentors = await client.query(`
    SELECT a.author_name AS author, m.author_name AS mentor
    FROM authors a
    LEFT JOIN authors m ON a.mentor = m.author_id;
  `);
  console.table(mentors.rows);

  const papers = await client.query(`
    SELECT a.author_name, rp.paper_title
    FROM authors a
    LEFT JOIN author_papers ap ON a.author_id = ap.author_id
    LEFT JOIN research_papers rp ON ap.paper_id = rp.paper_id;
  `);
  console.table(papers.rows);

  await client.end();
}

main().catch(console.error);
