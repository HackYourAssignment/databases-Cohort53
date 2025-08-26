import pkg from "pg";
const { Client } = pkg;

const defaultClient = new Client({
  user: "hyfuser",
  host: "localhost",
  database: "postgres",
  password: "hyfpassword",
  port: 5432,
});

async function setupDatabase() {
  try {
    await defaultClient.connect();

    await defaultClient.query(`DROP DATABASE IF EXISTS meetup;`);
    await defaultClient.query(`CREATE DATABASE meetup;`);
    console.log('Database "meetup" created.');

    await defaultClient.end();

    const client = new Client({
      user: "hyfuser",
      host: "localhost",
      database: "meetup",
      password: "hyfpassword",
      port: 5432,
    });
    await client.connect();

    await client.query(`
      CREATE TABLE Invitee (
        invitee_no INT PRIMARY KEY,
        invitee_name VARCHAR(100),
        invited_by VARCHAR(100)
      );
    `);

    await client.query(`
      CREATE TABLE Room (
        room_no INT PRIMARY KEY,
        room_name VARCHAR(64),
        floor_number INT
      );
    `);

    await client.query(`
      CREATE TABLE Meeting (
        meeting_no INT PRIMARY KEY,
        meeting_title VARCHAR(64),
        starting_time TIMESTAMP,
        ending_time TIMESTAMP,
        room_no INT REFERENCES Room(room_no)
      );
    `);

    console.log("Tables created.");

    await client.query(`
      INSERT INTO Invitee VALUES
      (1, 'Alice Johnson', 'Bob Smith'),
      (2, 'Bob Smith', 'Carol White'),
      (3, 'Carol White', 'David Lee'),
      (4, 'David Lee', 'Alice Johnson'),
      (5, 'Eve Brown', 'Bob Smith');
    `);

    await client.query(`
      INSERT INTO Room VALUES
      (101, 'Blue Room', 1),
      (102, 'Green Room', 1),
      (201, 'Yellow Room', 2),
      (202, 'Red Room', 2),
      (301, 'Conference Hall', 3);
    `);

    await client.query(`
      INSERT INTO Meeting VALUES
      (1, 'Project Kickoff', '2025-09-01 09:00:00', '2025-09-01 10:00:00', 101),
      (2, 'Design Review', '2025-09-02 11:00:00', '2025-09-02 12:30:00', 102),
      (3, 'Team Standup', '2025-09-03 09:30:00', '2025-09-03 10:00:00', 201),
      (4, 'Client Presentation', '2025-09-04 14:00:00', '2025-09-04 15:30:00', 202),
      (5, 'Retrospective', '2025-09-05 16:00:00', '2025-09-05 17:00:00', 301);
    `);

    console.log("Sample data inserted.");

    await client.end();
    console.log("Setup complete.");
  } catch (err) {
    console.error("Error:", err);
    await defaultClient.end();
  }
}

setupDatabase();
