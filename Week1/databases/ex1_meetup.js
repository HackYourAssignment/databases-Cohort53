require("dotenv").config();
const { Client } = require("pg");

// Admin connection (connects to default "postgres" DB)
// Used only for creating/dropping the "meetup" database
const adminConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "postgres",
};

// Config to connect to the actual "meetup" DB
const meetupConfig = { ...adminConfig, database: "meetup" };

async function run() {
  let admin; // reference to admin client
  let db; // reference to meetup client

  try {
    // ================================
    // 1. Reset the "meetup" database
    // ================================
    admin = new Client(adminConfig);
    await admin.connect();

    // Terminate active connections (safety measure)
    await admin.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'meetup' AND pid <> pg_backend_pid();
    `);

    // Drop and recreate the database
    await admin.query(`DROP DATABASE IF EXISTS meetup;`);
    await admin.query(`CREATE DATABASE meetup;`);

    // Close admin connection (not needed anymore)
    await admin.end();
    admin = null;

    // ================================
    // 2. Connect to "meetup" database
    // ================================
    db = new Client(meetupConfig);
    await db.connect();

    // Drop old tables (if they exist, order matters because of FK dependencies)
    await db.query(`DROP TABLE IF EXISTS Meeting;`);
    await db.query(`DROP TABLE IF EXISTS Room;`);
    await db.query(`DROP TABLE IF EXISTS Invitee;`);

    // ================================
    // 3. Create tables
    // ================================

    // Invitees table: list of people and who invited them
    await db.query(`
      CREATE TABLE Invitee (
        invitee_no   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        invitee_name VARCHAR(100) NOT NULL,
        invited_by   VARCHAR(100) NOT NULL
      );
    `);

    // Rooms table: meeting rooms with floor number
    await db.query(`
      CREATE TABLE Room (
        room_no       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        room_name     VARCHAR(100) NOT NULL,
        floor_number  SMALLINT NOT NULL,
        CONSTRAINT room_floor_number_range CHECK (floor_number BETWEEN -5 AND 200)
      );
    `);

    // Meetings table: references Room
    await db.query(`
      CREATE TABLE Meeting (
        meeting_no    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        meeting_title VARCHAR(200) NOT NULL,
        starting_time TIMESTAMPTZ NOT NULL,
        ending_time   TIMESTAMPTZ NOT NULL,
        room_no       INTEGER NOT NULL REFERENCES Room(room_no),
        CONSTRAINT meeting_time_valid CHECK (ending_time > starting_time)
      );
    `);

    // ================================
    // 4. Seed data
    // ================================

    // Insert 5 invitees
    await db.query(`
      INSERT INTO Invitee (invitee_name, invited_by) VALUES
        ('Alice','Vlad'),
        ('Bob','Vlad'),
        ('Carol','Dima'),
        ('David','Dima'),
        ('Eve','Lena');
    `);

    // Insert 5 rooms and return generated IDs
    const rooms = await db.query(`
      INSERT INTO Room (room_name, floor_number) VALUES
        ('Amsterdam', 1),
        ('Rotterdam', 2),
        ('Utrecht',   3),
        ('Eindhoven', 2),
        ('Haarlem',   1)
      RETURNING room_no;
    `);

    // Extract room_no values to bind in Meeting inserts
    const r = rooms.rows.map((x) => x.room_no);

    // Insert 5 meetings linked to the inserted rooms
    await db.query(
      `
      INSERT INTO Meeting (meeting_title, starting_time, ending_time, room_no) VALUES
        ('Intro to Databases',    '2025-08-27 10:00+00', '2025-08-27 11:00+00', $1),
        ('PostgreSQL Basics',     '2025-08-27 12:00+00', '2025-08-27 13:00+00', $2),
        ('Schema Design',         '2025-08-28 10:00+00', '2025-08-28 11:30+00', $3),
        ('SQL CRUD Practice',     '2025-08-28 12:00+00', '2025-08-28 13:00+00', $4),
        ('Indexes & Performance', '2025-08-29 09:30+00', '2025-08-29 10:30+00', $5);
      `,
      r.slice(0, 5) // bind five room IDs
    );

    console.log(" Exercise 1: DONE (database, tables, and seed data inserted)");
  } catch (err) {
    console.error("Script failed:", err);
    process.exitCode = 1; // do not force quit immediately, allow finally block
  } finally {
    // Ensure connections are closed even if error occurred
    if (db) {
      try {
        await db.end();
      } catch {}
    }
    if (admin) {
      try {
        await admin.end();
      } catch {}
    }
  }
}

run();
