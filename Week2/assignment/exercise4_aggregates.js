import { setupDatabase } from './connectDatabase.js';

// query aggregates
async function queryAggregates() {
  const client = await setupDatabase();
  try{
  const result1 = await client.query(`
      -- 1. All research papers and the number of authors that wrote each paper
      SELECT rp.paper_title, COUNT(ap.author_id) AS num_authors
      FROM authors_papers ap
      INNER JOIN research_papers rp
          ON ap.paper_id = rp.paper_id
      GROUP BY rp.paper_title
      ORDER BY num_authors DESC;
    `);
  console.log('Successful query!', result1.rows);

  const result2 = await client.query(`
      -- 2. Sum of the research papers published by all female authors
      SELECT COUNT(ap.paper_id) AS total_papers_female
      FROM authors a
      INNER JOIN authors_papers ap
          ON a.author_id = ap.author_id
      WHERE a.gender = 'F';
    `);
  console.log('Successful query!', result2.rows);

  const result3 = await client.query(`
      -- 3. Average of the h-index of all authors per university
      SELECT a.university, AVG(a.h_index) AS avg_h_index
      FROM authors AS a
      GROUP BY a.university
      ORDER BY avg_h_index DESC;
    `);
  console.log('Successful query!', result3.rows);

  const result4 = await client.query(`
      -- 4. Sum of the research papers of the authors per university
      SELECT a.university, COUNT(ap.paper_id) AS total_papers
      FROM authors AS a
      INNER JOIN authors_papers AS ap
          ON a.author_id = ap.author_id
      GROUP BY a.university
      ORDER BY total_papers DESC;
    `);
  console.log('Successful query!', result4.rows);

  const result5 = await client.query(`
      -- 5. Minimum and maximum of the h-index of all authors per university
      SELECT a.university, MIN(a.h_index) AS min_h_index, MAX(a.h_index) AS max_h_index
      FROM authors AS a
      GROUP BY a.university
      ORDER BY a.university;
    `);
  console.log('Successful query!', result5.rows);

  } catch (error) {
    console.error('Error querying tables:', error);
  } finally {
    await client.end();
  }
}

export async function main4() {
  const client1 = await setupDatabase();
  await client1.end();

  await queryAggregates();
  console.log('3.4 Exercise 4: Aggregate Functions completed successfully!');
}