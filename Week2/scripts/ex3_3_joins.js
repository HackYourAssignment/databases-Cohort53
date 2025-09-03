// ex3_3_joins.js
// Week2 – Exercise 3.3 (Joins)

import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Client } = pg;

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
  console.table(res.rows.slice(0, 15));
}

async function run() {
  try {
    await db.connect();

    // 1) names of all authors and their mentors
    await q(
      "Authors and their mentors",
      `SELECT a.author_name AS author, m.author_name AS mentor
       FROM authors a
       LEFT JOIN authors m ON a.mentor = m.author_id
       ORDER BY author;`
    );

    // 2) all columns of authors and their published paper_title
    //    include authors without papers
    await q(
      "Authors and their papers (include authors without papers)",
      `SELECT a.*, rp.paper_title
       FROM authors a
       LEFT JOIN author_papers ap ON ap.author_id = a.author_id
       LEFT JOIN research_papers rp ON rp.paper_id = ap.paper_id
       ORDER BY a.author_id, rp.paper_title NULLS LAST;`
    );

    console.log("\n ex3_3_joins: done");
  } catch (e) {
    console.error(" ex3_3_joins failed:", e);
    process.exitCode = 1;
  } finally {
    try {
      await db.end();
    } catch {}
  }
}
run();
