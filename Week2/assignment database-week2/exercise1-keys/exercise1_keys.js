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
    await pool.query("DROP TABLE IF EXISTS authors");
    console.log("Table dropped successfully");
    const queryText = `
    CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    author_name VARCHAR(50)NOT NULL,
    university VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    h_index INT,
    gender VARCHAR(10) NOT NULL CHECK(gender in('Male', 'Female'))
);
`;
    await pool.query(queryText);
    console.log("Table Successfully created");

    await pool.query(`
    ALTER TABLE authors
    ADD COLUMN  mentor INT;
    `);
    console.log("Column mentor added successfully");

    await pool.query(`
    ALTER TABLE authors
    ADD CONSTRAINT fk_mentor
    Foreign Key (mentor) REFERENCES authors(author_id);
    `);
    console.log("Foreign key fk_mentor added successfully");

    
  } catch (error) {
    console.error("Error", error);
  } finally {
    await pool.end();
  }
}
main();
