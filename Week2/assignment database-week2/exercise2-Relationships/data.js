import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "authors_db",
  port: 5432,
});

async function insertData() {
  try {
  
    await pool.query(`
      INSERT INTO authors (author_name, university, date_of_birth, h_index, gender, mentor)
      VALUES
      ('Aref Al-Ademi', 'Al-Mansoori University', '1980-05-10', 25, 'Male', 14),
      ('Sara Ali', 'Cairo University', '1985-02-20', 30, 'Female', 1),
      ('John Smith', 'MIT', '1975-11-15', 40, 'Male', 1),
      ('Jane Doe', 'Stanford', '1982-07-30', 35, 'Female', 2),
      ('Author 5', 'University 5', '1981-01-01', 20, 'Male', 3),
      ('Author 6', 'University 6', '1983-03-12', 22, 'Female', 4),
      ('Author 7', 'University 7', '1979-12-05', 18, 'Male', 5),
      ('Author 8', 'University 8', '1986-06-17', 28, 'Female', 6),
      ('Author 9', 'University 9', '1980-09-21', 25, 'Male', 7),
      ('Author 10', 'University 10', '1984-04-10', 30, 'Female', 8),
      ('Author 11', 'University 11', '1978-08-08', 19, 'Male', 9),
      ('Author 12', 'University 12', '1987-03-25', 27, 'Female', 10),
      ('Author 13', 'University 13', '1981-10-11', 24, 'Male', 11),
      ('Author 14', 'University 14', '1985-12-19', 32, 'Female', 12),
      ('Author 15', 'University 15', '1982-01-05', 26, 'Male', 13)
      ON CONFLICT DO NOTHING
    `);
   
    await pool.query(`
      INSERT INTO research_papers (paper_title, conference, publish_date)
      VALUES
      ('Paper 1', 'Conf A', '2020-01-10'),
      ('Paper 2', 'Conf B', '2020-03-15'),
      ('Paper 3', 'Conf C', '2019-07-20'),
      ('Paper 4', 'Conf D', '2021-02-11'),
      ('Paper 5', 'Conf E', '2018-06-30'),
      ('Paper 6', 'Conf F', '2020-11-05'),
      ('Paper 7', 'Conf G', '2019-09-19'),
      ('Paper 8', 'Conf H', '2021-01-22'),
      ('Paper 9', 'Conf I', '2020-05-14'),
      ('Paper 10', 'Conf J', '2021-08-30'),
      ('Paper 11', 'Conf A', '2019-04-10'),
      ('Paper 12', 'Conf B', '2020-12-01'),
      ('Paper 13', 'Conf C', '2018-07-18'),
      ('Paper 14', 'Conf D', '2021-03-11'),
      ('Paper 15', 'Conf E', '2020-06-22'),
      ('Paper 16', 'Conf F', '2019-11-05'),
      ('Paper 17', 'Conf G', '2021-02-19'),
      ('Paper 18', 'Conf H', '2020-01-22'),
      ('Paper 19', 'Conf I', '2019-05-14'),
      ('Paper 20', 'Conf J', '2021-08-30'),
      ('Paper 21', 'Conf A', '2020-02-10'),
      ('Paper 22', 'Conf B', '2019-03-15'),
      ('Paper 23', 'Conf C', '2021-07-20'),
      ('Paper 24', 'Conf D', '2020-02-11'),
      ('Paper 25', 'Conf E', '2018-06-30'),
      ('Paper 26', 'Conf F', '2020-11-05'),
      ('Paper 27', 'Conf G', '2019-09-19'),
      ('Paper 28', 'Conf H', '2021-01-22'),
      ('Paper 29', 'Conf I', '2020-05-14'),
      ('Paper 30', 'Conf J', '2021-08-30')
      ON CONFLICT DO NOTHING
    `);
    await pool.query(`
      INSERT INTO authors_papers (author_id, paper_id)
      VALUES
      (1,1),(1,2),(2,3),(2,4),(3,5),(3,6),
      (4,7),(4,8),(5,9),(5,10),(6,11),(6,12),
      (7,13),(7,14),(8,15),(8,16),(9,17),(9,18),
      (10,19),(10,20),(11,21),(11,22),(12,23),(12,24),
      (13,25),(13,26),(14,27),(14,28),(15,29),(15,30)
      ON CONFLICT DO NOTHING
    `);

    console.log("Data insertion completed successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

insertData();
