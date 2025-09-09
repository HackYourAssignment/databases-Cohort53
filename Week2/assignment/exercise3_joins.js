import { setupDatabase } from './connectDatabase.js';

// Query authors and their mentors
export async function authorsAndMentors() {
  const client = await setupDatabase();
  try {
   const result1 = await client.query(`
    SELECT a.author_name AS author,
           m.author_name AS mentor
    FROM authors AS a
    INNER JOIN authors AS m
           ON a.mentor = m.author_id;
    `);
    console.log('Successful query!', result1.rows);
  } catch (error) {
    console.error('Error querying tables:', error);
  } finally {
    await client.end();
  }
}

// Query authors with publications
export async function authorsWithPublications() {
  const client = await setupDatabase();
  try {
    const result2 = await client.query(`
      SELECT a.*, rp.paper_title
      FROM authors AS a
      LEFT JOIN authors_papers AS ap
        ON a.author_id = ap.author_id
      LEFT JOIN research_papers AS rp
        ON ap.paper_id = rp.paper_id;
    `);
    console.log('Successful query!', result2.rows);
  } catch (error) {
    console.error('Error querying tables:', error);
  } finally {
    await client.end();
  }
}

export async function main3() {
  const client1 = await setupDatabase();
  await client1.end();

  await authorsAndMentors();
  await authorsWithPublications();
  console.log('Exercise 3: Joins completed successfully!');
}