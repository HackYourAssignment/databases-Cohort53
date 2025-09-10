import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "db-assignment-w2",
});

async function setupRelationships() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");

    await client.query(`
      CREATE TABLE IF NOT EXISTS research_papers(
      paper_id SERIAL PRIMARY KEY,
      paper_title VARCHAR(100),
      conference VARCHAR(100),
      publish_date DATE
      )`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS author_papers(
        author_id INTEGER REFERENCES authors(author_id),
        paper_id INTEGER REFERENCES research_papers(paper_id),
        PRIMARY KEY (author_id, paper_id)
      ) `);

    await client.query(`
      INSERT INTO authors (author_name, university, date_of_birth, h_index, gender, mentor) VALUES
        ('Alice Johnson', 'MIT', '1980-05-12', 45, 'female', 2),
        ('Bob Smith', 'Stanford', '1975-09-23', 38, 'male', 3),
        ('Clara Lee', 'Harvard', '1985-03-15', 50, 'female', 4),
        ('David Kim', 'Oxford', '1990-07-01', 22, 'male', 5),
        ('Elena Rossi', 'Cambridge', '1978-11-30', 60, 'female', 6),
        ('Frank Miller', 'ETH Zurich', '1982-08-19', 41, 'male', 7),
        ('Grace Chen', 'Tsinghua', '1988-04-10', 33, 'female', 8),
        ('Henry Wilson', 'University of Tokyo', '1973-02-28', 55, 'male', 9),
        ('Isabella Lopez', 'UCLA', '1992-12-05', 18, 'female', 10),
        ('Jack Brown', 'University of Toronto', '1986-01-22', 29, 'male', 11),
        ('Karen Davis', 'Imperial College London', '1979-06-14', 47, 'female', 12),
        ('Leo Martin', 'Seoul National University', '1984-10-09', 35, 'male', 13),
        ('Maria Silva', 'University of São Paulo', '1991-09-17', 25, 'female', 14),
        ('Nikolai Petrov', 'Moscow State University', '1987-03-27', 40, 'male', 15),
        ('Olivia White', 'Princeton', '1983-05-08', 52, 'female', 1);
      `);

    await client.query(`
      INSERT INTO author_papers (author_id, paper_id) VALUES
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 6),
        (7, 7),
        (8, 8),
        (9, 9),
        (10, 10),
        (11, 11),
        (12, 12),
        (13, 13),
        (14, 14),
        (15, 15);
    `);

    await client.query(`
      INSERT INTO research_papers (paper_title, conference, publish_date) VALUES
      ('AI in Healthcare', 'NeurIPS', '2019-12-01'),
      ('Quantum Computing Advances', 'QIP', '2020-01-15'),
      ('Deep Learning for Vision', 'CVPR', '2021-06-20'),
      ('Blockchain Security', 'IEEE S&P', '2018-05-10'),
      ('Climate Change Models', 'COP', '2020-11-05'),
      ('Robotics in Industry', 'ICRA', '2019-05-25'),
      ('Natural Language Processing', 'ACL', '2021-08-03'),
      ('Cybersecurity Trends', 'BlackHat', '2019-07-30'),
      ('Autonomous Vehicles', 'ICCV', '2020-10-12'),
      ('Big Data Analytics', 'KDD', '2018-08-20'),
      ('Genomics and AI', 'Bioinformatics Conf', '2021-03-18'),
      ('Renewable Energy Systems', 'EnergyConf', '2020-04-14'),
      ('Smart Cities', 'UrbanTech', '2019-09-07'),
      ('5G Networks', 'MobileWorldCongress', '2019-02-26'),
      ('Space Exploration Tech', 'IAF', '2020-10-24'),
      ('Ethics in AI', 'NeurIPS', '2021-12-05'),
      ('Augmented Reality Apps', 'SIGGRAPH', '2018-07-12'),
      ('Data Privacy', 'PrivacyConf', '2021-09-15'),
      ('Edge Computing', 'CloudExpo', '2020-06-11'),
      ('Bioengineering Breakthroughs', 'BioTechConf', '2019-03-29'),
      ('AI for Finance', 'FinTechConf', '2020-11-21'),
      ('Computer Vision in Medicine', 'MICCAI', '2019-10-17'),
      ('Machine Translation', 'ACL', '2021-08-25'),
      ('Neural Networks Optimization', 'ICML', '2018-07-05'),
      ('Green Computing', 'SustainableTech', '2020-09-30'),
      ('Internet of Things', 'IoTConf', '2019-11-02'),
      ('Educational Technologies', 'EdTechSummit', '2021-04-19'),
      ('Nanotechnology Devices', 'NanoConf', '2020-05-13'),
      ('Human-Computer Interaction', 'CHI', '2018-04-23'),
      ('Social Media Analytics', 'WebConf', '2019-05-16');
    `);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

setupRelationships();
