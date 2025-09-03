// ex3_4_aggregates.js
// Week2 – Exercise 3.4 (Aggregate Functions)

require("dotenv").config();
const { Client } = require("pg");

const db = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "research",
});

async function q(label, sql, params = []) {
  const res = await db.query(sql, params);
  console.log(`\n=== ${label} ===`);
  console.table(res.rows.slice(0, 20));
}

async function run() {
  try {
    await db.connect();

    // 1) All research papers and the number of authors that wrote that paper
    await q(
      "Paper → number of authors",
      `SELECT rp.paper_title, COUNT(ap.author_id) AS authors_count
       FROM research_papers rp
       LEFT JOIN author_papers ap ON ap.paper_id = rp.paper_id
       GROUP BY rp.paper_id, rp.paper_title
       ORDER BY authors_count DESC, rp.paper_title;`
    );

    // 2) Sum of the research papers published by all female authors
    await q(
      "Total papers by female authors",
      `SELECT SUM(cnt) AS total_papers_by_female
       FROM (
         SELECT a.author_id, COUNT(ap.paper_id) AS cnt
         FROM authors a
         LEFT JOIN author_papers ap ON ap.author_id = a.author_id
         WHERE a.gender = 'female'
         GROUP BY a.author_id
       ) x;`
    );

    // 3) Average of the h-index of all authors per university
    await q(
      "Average h-index per university",
      `SELECT university, ROUND(AVG(h_index)::numeric, 2) AS avg_h_index
       FROM authors
       GROUP BY university
       ORDER BY university;`
    );

    // 4) Sum of the research papers of the authors per university
    await q(
      "Sum of papers per university",
      `SELECT a.university, COUNT(ap.paper_id) AS papers_sum
       FROM authors a
       LEFT JOIN author_papers ap ON ap.author_id = a.author_id
       GROUP BY a.university
       ORDER BY papers_sum DESC, a.university;`
    );

    // 5) Min/Max h-index per university
    await q(
      "Min/Max h-index per university",
      `SELECT university,
              MIN(h_index) AS min_h,
              MAX(h_index) AS max_h
       FROM authors
       GROUP BY university
       ORDER BY university;`
    );

    console.log("\n ex3_4_aggregates: done");
  } catch (e) {
    console.error(" ex3_4_aggregates failed:", e);
    process.exitCode = 1;
  } finally {
    try {
      await db.end();
    } catch {}
  }
}
run();
