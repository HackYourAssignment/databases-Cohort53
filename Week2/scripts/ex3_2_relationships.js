// ex3_2_relationships.js
// Week2 – Exercise 3.2 (Relationships)
// Adds research_papers, author_papers; inserts 15 authors, 30 papers, and links.

import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Client } = pg;

const DB_NAME = "research";
const db = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: DB_NAME,
});

async function run() {
  try {
    await db.connect();

    // 1) Tables for papers and m:n link
    await db.query(`
      CREATE TABLE IF NOT EXISTS research_papers (
        paper_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        paper_title  TEXT NOT NULL UNIQUE,
        conference   TEXT,
        publish_date DATE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS author_papers (
        author_id INTEGER NOT NULL REFERENCES authors(author_id) ON DELETE CASCADE,
        paper_id  INTEGER NOT NULL REFERENCES research_papers(paper_id) ON DELETE CASCADE,
        PRIMARY KEY (author_id, paper_id)
      );
    `);

    // 2) Seed 15 authors (some mentors set later)
    const authors = [
      ["Alice Kim", "TU Delft", "1988-03-01", 12, "female"],
      ["Bob Ivanov", "UvA", "1985-06-10", 18, "male"],
      ["Carla Gomez", "VU", "1990-12-01", 9, "female"],
      ["Dmitri Petrov", "TU Delft", "1982-07-22", 22, "male"],
      ["Eve Tan", "Leiden", "1991-09-19", 7, "female"],
      ["Felix Zhou", "TU/e", "1986-01-05", 15, "male"],
      ["Gina Rossi", "UvA", "1992-04-14", 6, "female"],
      ["Hiro Sato", "TU Delft", "1984-11-08", 24, "male"],
      ["Ivy Wang", "Leiden", "1993-02-17", 5, "female"],
      ["Jamal Noor", "VU", "1987-08-03", 11, "male"],
      ["Kira Novak", "UvA", "1990-01-29", 8, "female"],
      ["Leo Martins", "TU/e", "1983-03-13", 19, "male"],
      ["Mina Park", "Leiden", "1994-04-04", 4, "female"],
      ["Nate Quinn", "TU Delft", "1989-06-06", 13, "male"],
      ["Ola Berg", "VU", "1985-10-10", 17, "male"],
    ];

    await db.query(`TRUNCATE authors RESTART IDENTITY CASCADE;`);
    for (const a of authors) {
      await db.query(
        `INSERT INTO authors(author_name,university,date_of_birth,h_index,gender)
         VALUES ($1,$2,$3,$4,$5);`,
        a
      );
    }

    await db.query(
      `UPDATE authors SET mentor = 4  WHERE author_id IN (1,3,5);`
    );
    await db.query(
      `UPDATE authors SET mentor = 8  WHERE author_id IN (2,6,7);`
    );
    await db.query(
      `UPDATE authors SET mentor = 12 WHERE author_id IN (9,10,11);`
    );
    await db.query(
      `UPDATE authors SET mentor = 4  WHERE author_id IN (13,14,15);`
    );

    // 3) Seed 30 papers
    await db.query(`TRUNCATE research_papers RESTART IDENTITY CASCADE;`);
    const confs = ["ICDB", "SIGMOD", "VLDB", "ICDE", "EDBT"];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const title = `On Relational Patterns ${i}`;
      const conf = confs[i % confs.length];
      const date = new Date(today.getFullYear() - (i % 8), i % 12, (i % 28) + 1)
        .toISOString()
        .slice(0, 10);
      await db.query(
        `INSERT INTO research_papers(paper_title,conference,publish_date)
         VALUES ($1,$2,$3);`,
        [title, conf, date]
      );
    }

    // 4) Link authors to papers
    await db.query(`TRUNCATE author_papers;`);
    for (let paperId = 1; paperId <= 30; paperId++) {
      const a1 = ((paperId + 0) % 15) + 1;
      const a2 = ((paperId + 3) % 15) + 1;
      const a3 = ((paperId + 7) % 15) + 1;
      const pick = new Set([a1, a2, ...(paperId % 3 === 0 ? [a3] : [])]);
      for (const aid of pick) {
        await db.query(
          `INSERT INTO author_papers(author_id,paper_id)
           VALUES ($1,$2) ON CONFLICT DO NOTHING;`,
          [aid, paperId]
        );
      }
    }

    console.log(" ex3_2_relationships: papers, links, and seed inserted");
  } catch (e) {
    console.error(" ex3_2_relationships failed:", e);
    process.exitCode = 1;
  } finally {
    try {
      await db.end();
    } catch {}
  }
}
run();
