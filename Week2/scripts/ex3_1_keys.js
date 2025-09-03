// ex3_1_keys.js
// Week2 – Exercise 3.1 (Keys)
// Creates DB "research", table authors, and adds self-referencing FK "mentor".

import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Client } = pg;

const DB_NAME = "research";

const admin = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "postgres",
});

const research = (dbName = DB_NAME) =>
  new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: dbName,
  });

async function run() {
  let root, db;
  try {
    // 1) Create DB "research" fresh (idempotent)
    root = admin;
    await root.connect();
    await root.query(
      `SELECT pg_terminate_backend(pid)
                      FROM pg_stat_activity
                      WHERE datname = $1 AND pid <> pg_backend_pid();`,
      [DB_NAME]
    );
    await root.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);
    await root.query(`CREATE DATABASE ${DB_NAME};`);
    await root.end();
    root = null;

    // 2) Connect to research and create authors
    db = research();
    await db.connect();

    await db.query(`
      CREATE TABLE authors (
        author_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        author_name   TEXT    NOT NULL,
        university    TEXT    NOT NULL,
        date_of_birth DATE,
        h_index       SMALLINT CHECK (h_index >= 0),
        gender        TEXT CHECK (gender IN ('male','female','nonbinary','other'))
      );
    `);

    // 3) Add mentor column that references authors.author_id (self FK)
    await db.query(`
      ALTER TABLE authors
      ADD COLUMN mentor INTEGER NULL;
    `);

    await db.query(`
      ALTER TABLE authors
      ADD CONSTRAINT fk_authors_mentor
      FOREIGN KEY (mentor) REFERENCES authors(author_id)
      ON DELETE SET NULL;
    `);

    console.log(" ex3_1_keys: authors created, mentor FK added");
  } catch (e) {
    console.error(" ex3_1_keys failed:", e);
    process.exitCode = 1;
  } finally {
    if (root) {
      try {
        await root.end();
      } catch {}
    }
    if (db) {
      try {
        await db.end();
      } catch {}
    }
  }
}
run();
