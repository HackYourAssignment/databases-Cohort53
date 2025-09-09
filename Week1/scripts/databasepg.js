import { Client } from "pg";

const client = new Client({
  host: "localhost",
  user: "hyfuser",
  port: 5432,
  password: "hyfpassword",
  database: "meetup",
});

async function initializeDatabase() {
  try {
    await client.connect();
    console.log("Connected to PostgresQL");

    await client.query(`
      CREATE TABLE IF NOT EXISTS Invitee(
      invitee_no SERIAL PRIMARY KEY,
      invitee_name VARCHAR(100),
      invited_by VARCHAR(100)
      )`);

    // Remove all rows before inserting new data to avoid duplicates
    await client.query(`DELETE FROM Meeting;`);
    await client.query(`DELETE FROM Room;`);
    await client.query(`DELETE FROM Invitee;`);

    // Reset sequences so IDs start from 1
    await client.query(`ALTER SEQUENCE invitee_invitee_no_seq RESTART WITH 1;`);
    await client.query(`ALTER SEQUENCE room_room_no_seq RESTART WITH 1;`);
    await client.query(`ALTER SEQUENCE meeting_meeting_no_seq RESTART WITH 1;`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS Room(
      room_no SERIAL PRIMARY KEY,
      room_name VARCHAR(100),
      floor_number INTEGER
      ) `);

    await client.query(`DELETE FROM Room;`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS Meeting(
      meeting_no SERIAL PRIMARY KEY,
      meeting_title VARCHAR(100),
      starting_time TIMESTAMP,
      ending_time TIMESTAMP,
      room_no INTEGER REFERENCES Room(room_no)
      )
      `);

    await client.query(`
      INSERT INTO Invitee (invitee_name, invited_by) VALUES
      ('Scarlett Johansson', 'Aiden Cross'),
      ('Leonardo DiCaprio', 'Lila Montgomery'),
      ('Taylor Swift', 'Ethan Caldwell'),
      ('Chris Hemsworth', 'Sophia Bennett'),
      ('Emma Watson', 'Jackson Rivers')
      `);

    await client.query(`
    INSERT INTO Room(room_name, floor_number) VALUES
    ('black room', 2),
    ('white room', 3),
    ('silver room', 4),
    ('black room', 2),
    ('golden room', 1)
    `);

    const rooms = await client.query(`SELECT room_no FROM Room`);
    const roomIds = rooms.rows.map((r) => r.room_no);

    const meetingsData = [
      {
        title: "Kickoff",
        start: "2025-08-27 10:00:00",
        end: "2025-08-27 12:00:00",
      },
      {
        title: "Planning Session",
        start: "2025-08-27 13:00:00",
        end: "2025-08-27 14:00:00",
      },
      {
        title: "Team Meeting",
        start: "2025-08-27 14:30:00",
        end: "2025-08-27 15:30:00",
      },
      {
        title: "Retrospective",
        start: "2025-08-27 16:00:00",
        end: "2025-08-27 17:00:00",
      },
      {
        title: "Client Presentation",
        start: "2025-08-27 17:30:00",
        end: "2025-08-27 18:00:00",
      },
    ];

    for (const m of meetingsData) {
      const randomRoom = roomIds[Math.floor(Math.random() * roomIds.length)];
      await client.query(
        `INSERT INTO Meeting(meeting_title, starting_time, ending_time, room_no)
         VALUES ($1, $2, $3, $4)`,
        [m.title, m.start, m.end, randomRoom]
      );
    }

    console.log("Tables Invitee, Room, and Meeting created and populated!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

initializeDatabase();
