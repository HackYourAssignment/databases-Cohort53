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
    CREATE TABLE IF NOT EXISTS research_papers (
      paper_id SERIAL PRIMARY KEY,
      paper_title VARCHAR(255) NOT NULL,
      conference VARCHAR(100),
      publish_date DATE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS author_papers (
      author_id INT REFERENCES authors(author_id),
      paper_id INT REFERENCES research_papers(paper_id),
      PRIMARY KEY (author_id, paper_id)
    );
  `);

  console.log("Research papers and author_papers tables created");
  await client.query(`
    INSERT INTO authors (author_name, university, date_of_birth, h_index, gender)
    VALUES
      ('Alice Smith', 'MIT', '1980-05-10', 42, 'Female'),
      ('Bob Johnson', 'Stanford', '1975-09-20', 55, 'Male'),
      ('Carol Lee', 'Harvard', '1985-01-15', 38, 'Female')
    ON CONFLICT DO NOTHING;
  `);

  await client.query(`
    INSERT INTO research_papers (paper_title, conference, publish_date)
    VALUES
      ('AI in Healthcare', 'NeurIPS', '2020-12-01'),
      ('Quantum Computing Advances', 'QCon', '2021-06-15'),
      ('Deep Learning Optimization', 'ICML', '2019-07-07')
    ON CONFLICT DO NOTHING;
  `);

  await client.query(`
    INSERT INTO author_papers (author_id, paper_id)
    VALUES (1,1), (2,1), (1,2), (3,3)
    ON CONFLICT DO NOTHING;
  `);

  console.log("Sample authors and papers inserted");
  await client.end();
}

main().catch(console.error);
