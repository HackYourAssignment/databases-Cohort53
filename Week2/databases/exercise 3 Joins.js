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
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw to allow caller to handle if needed
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

main().catch((error) => {
  console.error("Failed to execute main function:", error);
  process.exit(1); // Exit with error code
});
