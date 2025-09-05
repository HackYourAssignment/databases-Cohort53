import { Client } from "pg";
import { authors, researchPapers, paperAuthors } from "./generateSampleData.js";

// Database connection configuration
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "DBassignmentW2",
  port: 5432,
};

const client = new Client(config);
let queryRes;

async function createDBviews(client) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create a view for all research papers and the number of authors that wrote that paper.
    const CREATE_AUTHOR_QUANTITY_VIEW = `
      CREATE OR REPLACE VIEW paper_authors_qty AS
      SELECT 
        paper_title,
        COUNT(pa.author_id) as number_of_authors
      FROM
        research_papers rp
        JOIN paper_authors pa ON rp.paper_id = pa.paper_id
        GROUP BY paper_title
    `;

    await client.query(CREATE_AUTHOR_QUANTITY_VIEW);
    // Query the view to verify it works
    queryRes = await client.query("SELECT * FROM paper_authors_qty");
    console.log(
      "\nResearch papers and the number of their authors:",
      JSON.stringify(queryRes.rows, null, 2)
    );

    // Create a view for the sum of the research papers published by all female authors.
    const CREATE_FEMALE_PAPER_NUMBER_VIEW = `
      CREATE OR REPLACE VIEW female_paper_number AS
        SELECT 
          COUNT(DISTINCT rp.paper_id) as publications_sum
        FROM
          research_papers rp
          JOIN paper_authors pa ON rp.paper_id = pa.paper_id
          JOIN authors a ON a.author_id = pa.author_id
        WHERE a.gender = 'Female'
    `;

    await client.query(CREATE_FEMALE_PAPER_NUMBER_VIEW);
    // Query the view to verify it works
    queryRes = await client.query("SELECT * FROM female_paper_number");
    console.log(
      "\nThe sum of the research papers published by all female authors:",
      JSON.stringify(queryRes.rows, null, 2)
    );

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

// Execute the seeding function
createDBviews(client);
