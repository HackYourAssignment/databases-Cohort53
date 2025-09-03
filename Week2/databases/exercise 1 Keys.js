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

  await client.query(`
    CREATE TABLE IF NOT EXISTS authors (
      author_id SERIAL PRIMARY KEY,
      author_name VARCHAR(100) NOT NULL,
      university VARCHAR(100),
      date_of_birth DATE,
      h_index INT,
      gender VARCHAR(10)
    );
  `);

  await client.query(`
    ALTER TABLE authors
    ADD COLUMN IF NOT EXISTS mentor INT,
    ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor) REFERENCES authors(author_id);
  `);

  console.log("Authors table created with self-referencing mentor key");
  await client.end();
}

main().catch(console.error);
