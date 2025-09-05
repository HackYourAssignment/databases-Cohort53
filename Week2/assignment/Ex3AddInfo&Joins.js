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

async function insertAuthors(client) {
  try {
    // Insert authors with mentors
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];
      // Set mentor to null for the first 5 authors (they will be mentors)
      // Others will have a random mentor from the first 5 authors
      const mentorId = i < 5 ? null : Math.floor(Math.random() * 5) + 1;

      const query = {
        text: `
          INSERT INTO authors (author_name, university, date_of_birth, h_index, gender, mentor)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING author_id
        `,
        values: [
          author.name,
          author.university,
          author.dob,
          author.hIndex,
          author.gender,
          mentorId,
        ],
      };

      const result = await client.query(query);
      console.log(
        `Inserted author: ${author.name} with ID: ${result.rows[0].author_id}`
      );
    }
    console.log("All authors inserted successfully");
  } catch (error) {
    console.error("Error inserting authors:", error);
    throw error;
  }
}

async function insertResearchPapers(client) {
  try {
    for (const paper of researchPapers) {
      const query = {
        text: `
          INSERT INTO research_papers (paper_title, conference, publish_date)
          VALUES ($1, $2, $3)
          RETURNING paper_id
        `,
        values: [paper.title, paper.conference, paper.date],
      };

      const result = await client.query(query);
      console.log(
        `Inserted paper: ${paper.title} with ID: ${result.rows[0].paper_id}`
      );
    }
    console.log("All research papers inserted successfully");
  } catch (error) {
    console.error("Error inserting research papers:", error);
    throw error;
  }
}

async function insertPaperAuthors(client) {
  try {
    for (const paperAuthor of paperAuthors) {
      const query = {
        text: `
          INSERT INTO paper_authors (paper_id, author_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `,
        values: [paperAuthor.paper_id, paperAuthor.authorId],
      };

      await client.query(query);
      console.log(
        `Linked paper ${paperAuthor.paper_id} with author ${paperAuthor.authorId}`
      );
    }
    console.log("All paper-author relationships inserted successfully");
  } catch (error) {
    console.error("Error inserting paper-author relationships:", error);
    throw error;
  }
}

async function seedDatabase(client) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Insert new data
    await insertAuthors(client);
    await insertResearchPapers(client);
    await insertPaperAuthors(client);

    // Create a view for all authors and their corresponding mentors
    const CREATE_AUTHOR_MENTOR_VIEW = `
      CREATE OR REPLACE VIEW author_mentor AS
      SELECT 
        author_name,
        mentor
      FROM 
        authors
    `;

    await client.query(CREATE_AUTHOR_MENTOR_VIEW);
    // Query the view to verify it works
    queryRes = await client.query("SELECT * FROM author_mentor");
    console.log(
      "\nAuthors with their mentors:",
      JSON.stringify(queryRes.rows, null, 2)
    );

    // Create a view for all the vegetarian recipes with potatoes
    const CREATE_AUTHORS_PAPERS_VIEW = `
      CREATE OR REPLACE VIEW authors_papers AS
      SELECT 
        a.author_name,
        rp.paper_title
      FROM 
        authors a
        JOIN LEFT paper_authors pa ON a.author_id = pa.author_id
        JOIN research_papers rp ON pa.paper_id = rp.paper_id
    `;

    await client.query(CREATE_AUTHORS_PAPERS_VIEW);
    // Query the view to verify it works
    queryRes = await client.query("SELECT * FROM authors_papers");
    if (queryRes.rows.length !== 0) {
      console.log(
        "\nAuthors with their papers:",
        JSON.stringify(queryRes.rows, null, 2)
      );
    } else {
      console.log("There are no papers in the database");
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

// Execute the seeding function
seedDatabase(client);
