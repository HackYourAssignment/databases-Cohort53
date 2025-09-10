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
  try {
    await client.connect();
    console.log("Connected to the database");

    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
          CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');
        END IF;
      END $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS authors (
        author_id SERIAL PRIMARY KEY,
        author_name VARCHAR(100) NOT NULL,
        university VARCHAR(100),
        date_of_birth DATE,
        h_index INT,
        gender gender_type,
        mentor INT,
        CONSTRAINT fk_mentor FOREIGN KEY (mentor) REFERENCES authors(author_id) ON DELETE SET NULL
      );
    `);

    console.log(
      "Authors table created with self-referencing mentor key and gender ENUM"
    );
  } catch (error) {
    console.error("Error occurred:", error.message);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

main().catch((error) => {
  console.error("Main function error:", error.message);
});
