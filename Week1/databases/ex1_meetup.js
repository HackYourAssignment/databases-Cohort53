// ex1_meetup.js
require("dotenv").config();
const { Client } = require("pg");

const adminConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "postgres", // connect to the default "postgres" DB to create/drop "meetup"
};

const meetupConfig = {
  ...adminConfig,
  database: "meetup",
};

async function run() {
  const admin = new Client(adminConfig);
  await admin.connect();

  // 1) Reset and recreate the DB (so the script can be run repeatedly)
  // Close active connections (just in case), then drop and create again
  await admin.query(`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = 'meetup' AND pid <> pg_backend_pid();
  `);
  await admin.query(`DROP DATABASE IF EXISTS meetup;`);
  await admin.query(`CREATE DATABASE meetup;`);
  await admin.end();

  // 2) Now work inside the "meetup" database
  const db = new Client(meetupConfig);
  await db.connect();

  // 3) Create tables (drop first just in case)
  await db.query(`DROP TABLE IF EXISTS Meeting;`);
  await db.query(`DROP TABLE IF EXISTS Room;`);
  await db.query(`DROP TABLE IF EXISTS Invitee;`);

  await db.query(`
    CREATE TABLE Invitee (
      invitee_no   SERIAL PRIMARY KEY,
      invitee_name VARCHAR(100) NOT NULL,
      invited_by   VARCHAR(100) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE Room (
      room_no      SERIAL PRIMARY KEY,
      room_name    VARCHAR(100) NOT NULL,
      floor_number INTEGER NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE Meeting (
      meeting_no    SERIAL PRIMARY KEY,
      meeting_title VARCHAR(200) NOT NULL,
      starting_time TIMESTAMP NOT NULL,
      ending_time   TIMESTAMP NOT NULL,
      room_no       INTEGER NOT NULL REFERENCES Room(room_no)
    );
  `);

  // 4) Seed data (5 rows per table)
  await db.query(`
    INSERT INTO Invitee (invitee_name, invited_by) VALUES
      ('Alice',  'Vlad'),
      ('Bob',    'Vlad'),
      ('Carol',  'Dima'),
      ('David',  'Dima'),
      ('Eve',    'Lena');
  `);

  const rooms = await db.query(`
    INSERT INTO Room (room_name, floor_number) VALUES
      ('Amsterdam', 1),
      ('Rotterdam', 2),
      ('Utrecht',   3),
      ('Eindhoven', 2),
      ('Haarlem',   1)
    RETURNING room_no;
  `);

  // Use actual room_no values returned by INSERT ... RETURNING
  const r = rooms.rows.map((x) => x.room_no);

  await db.query(
    `
    INSERT INTO Meeting (meeting_title, starting_time, ending_time, room_no) VALUES
      ('Intro to Databases',      '2025-08-27 10:00', '2025-08-27 11:00', $1),
      ('PostgreSQL Basics',       '2025-08-27 12:00', '2025-08-27 13:00', $2),
      ('Schema Design',           '2025-08-28 10:00', '2025-08-28 11:30', $3),
      ('SQL CRUD Practice',       '2025-08-28 12:00', '2025-08-28 13:00', $4),
      ('Indexes & Performance',   '2025-08-29 09:30', '2025-08-29 10:30', $5);
  `,
    r.slice(0, 5)
  ); // bind the five room_no placeholders

  console.log("Exercise 1: DONE (database, tables, and seed inserted)");
  await db.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
