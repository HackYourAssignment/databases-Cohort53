import { setupDatabase } from './connectDatabase.js';

// Create research_papers table
async function createResearchPapersTable() {
  const client = await setupDatabase();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_papers (
        paper_id SERIAL PRIMARY KEY,
        paper_title VARCHAR(200),
        conference VARCHAR(100),
        publish_date DATE
      );
    `);
    console.log('Table "research_papers" created successfully!');

// Create authors_papers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS authors_papers (
        author_id INT REFERENCES authors(author_id),
        paper_id INT REFERENCES research_papers(paper_id),
        PRIMARY KEY (author_id, paper_id)
      );
    `);
    console.log('Table "authors_papers" created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await client.end();
  }
}

// Insert authors data
async function insertAuthorsData() {
  const client = await setupDatabase();
  try {
    await client.query(`
      INSERT INTO authors (author_name, university, date_of_birth, h_index, gender) VALUES
      ('Alice Johnson', 'MIT', '1980-05-12', 45, 'F'),
      ('Bob Smith', 'Stanford', '1975-09-23', 50, 'M'),
      ('Clara Lee', 'Harvard', '1985-02-10', 38, 'F'),
      ('David Brown', 'Oxford', '1970-07-15', 60, 'M'),
      ('Eva Green', 'Cambridge', '1982-12-01', 42, 'F'),
      ('Frank White', 'ETH Zurich', '1978-11-30', 47, 'M'),
      ('Grace Kim', 'Seoul National', '1986-04-18', 33, 'F'),
      ('Henry Zhao', 'Tsinghua', '1979-06-05', 52, 'M'),
      ('Isabella Rossi', 'Polimi', '1983-08-20', 40, 'F'),
      ('Jack Wilson', 'Toronto', '1976-10-28', 49, 'M'),
      ('Karen Müller', 'TU Munich', '1981-03-12', 41, 'F'),
      ('Liam O''Connor', 'Trinity Dublin', '1984-09-09', 39, 'M'),
      ('Maria Lopez', 'UP Madrid', '1977-11-21', 46, 'F'),
      ('Noah Andersson', 'KTH Sweden', '1980-01-25', 44, 'M'),
      ('Olivia Dubois', 'Sorbonne', '1987-02-14', 32, 'F');
    `);
    console.log('Inserted successfully into "authors"!');
  } catch (error) {
    console.error('Error inserting authors:', error);
  } finally {
    await client.end();
  }
}

// Assign mentors
async function assignMentorsData() {
  const client = await setupDatabase();
  try {
    await client.query(`UPDATE authors SET mentor = 15 WHERE author_id IN (1,2);`);
    await client.query(`UPDATE authors SET mentor = 14 WHERE author_id IN (3,4);`);
    await client.query(`UPDATE authors SET mentor = 13 WHERE author_id IN (5,6);`);
    await client.query(`UPDATE authors SET mentor = 12 WHERE author_id IN (7,8);`);
    await client.query(`UPDATE authors SET mentor = 11 WHERE author_id IN (9,10);`);
    await client.query(`UPDATE authors SET mentor = 10 WHERE author_id IN (11,15);`);
    await client.query(`UPDATE authors SET mentor = 9 WHERE author_id IN (13,14);`);
    await client.query(`UPDATE authors SET mentor = NULL WHERE author_id IN (12);`);

    console.log('Mentors assigned to "authors" table successfully!');
  } catch (error) {
    console.error('Error assigning mentors:', error);
  } finally {
    await client.end();
  }
}

// Insert research_papers table data
async function insertResearchPapersData() {
  const client = await setupDatabase();
  try {
    await client.query(`
      INSERT INTO research_papers (paper_title, conference, publish_date) VALUES
      ('AI in Healthcare', 'NeurIPS', '2020-12-01'),
      ('Quantum Computing Basics', 'QCS', '2019-06-15'),
      ('Blockchain and Security', 'IEEE', '2021-03-20'),
      ('Machine Learning Trends', 'ICML', '2022-07-10'),
      ('Data Privacy', 'CCS', '2020-09-25'),
      ('Robotics Advances', 'IROS', '2021-11-12'),
      ('Natural Language Processing', 'ACL', '2022-05-18'),
      ('Autonomous Vehicles', 'CVPR', '2019-08-08'),
      ('Cloud Computing', 'ACM', '2020-02-14'),
      ('Cybersecurity Challenges', 'Usenix', '2021-12-03'),
      ('Deep Learning Applications', 'NeurIPS', '2022-01-20'),
      ('IoT Innovations', 'IEEE', '2019-04-17'),
      ('Augmented Reality', 'SIGGRAPH', '2021-07-09'),
      ('Big Data Analytics', 'KDD', '2020-10-11'),
      ('Software Engineering Trends', 'ICSE', '2022-03-05'),
      ('Genomics and AI', 'Nature', '2021-05-25'),
      ('Smart Cities', 'IEEE', '2020-11-30'),
      ('Edge Computing', 'ACM', '2021-08-15'),
      ('Human-Computer Interaction', 'CHI', '2019-09-20'),
      ('Reinforcement Learning', 'ICML', '2022-06-14'),
      ('Computer Vision', 'CVPR', '2021-02-28'),
      ('Neural Networks Optimization', 'NeurIPS', '2020-03-12'),
      ('Virtual Reality', 'SIGGRAPH', '2022-04-18'),
      ('Database Systems', 'VLDB', '2019-12-01'),
      ('Bioinformatics', 'ISMB', '2021-09-10'),
      ('Graph Algorithms', 'STOC', '2020-07-07'),
      ('Energy-efficient Computing', 'GreenCom', '2021-06-21'),
      ('Deep Reinforcement Learning', 'ICLR', '2022-01-15'),
      ('Social Network Analysis', 'WWW', '2020-05-30'),
      ('AI Ethics', 'AAAI', '2021-10-12');
    `);
    console.log('Inserted successfully into "research_papers" table!');

// Insert authors_papers links
    await client.query(`
      INSERT INTO authors_papers (author_id, paper_id) VALUES
      (1, 1), (2, 1),
      (3, 2), (4, 2),
      (5, 3),
      (6, 4), (7, 4), (8, 4),
      (9, 5), (10, 5),
      (11, 6), (12, 6), (13, 6),
      (14, 7),
      (1, 8),
      (2, 9), (3, 9),
      (4, 10), (5, 10),
      (6, 11), (7, 11),
      (8, 12),
      (9, 13), (10, 13),
      (11, 14), (12, 14),
      (13, 15),
      (14, 16),
      (1, 17),
      (2, 18), (3, 18),
      (4, 19),
      (5, 20), (6, 20),
      (7, 21),
      (8, 22), (9, 22),
      (10, 23),
      (11, 24), (12, 24),
      (13, 25),
      (14, 26),
      (1, 27),
      (2, 28), (3, 28),
      (4, 29),
      (5, 30);
    `);
    console.log('Inserted successfully into "authors_papers" table!');
  } catch (error) {
    console.error('Error inserting research data:', error);
  } finally {
    await client.end();
  }
}

export async function main2() {
  const client1 = await setupDatabase();
  await client1.end();

  await insertAuthorsData();
  await assignMentorsData();
  await createResearchPapersTable();
  await insertResearchPapersData();

  console.log('Exercise 2: Relationships completed successfully!');
}