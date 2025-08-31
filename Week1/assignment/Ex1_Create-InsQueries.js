import { Client } from "pg";

// Database connection configuration
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "meetup",
  port: 5432,
};

const client = new Client(config);

async function seedDatabase() {
  const CREATE_INVITEE_TABLE = `
    CREATE TABLE IF NOT EXISTS Invitee (
      invitee_no SERIAL PRIMARY KEY,
      invitee_name VARCHAR(50) NOT NULL,
      invited_by VARCHAR(50)
    )`;

  const CREATE_ROOM_TABLE = `
    CREATE TABLE IF NOT EXISTS Room (
      room_no SMALLINT PRIMARY KEY,
      room_name VARCHAR(50),
      floor_number SMALLINT
    )`;

  const CREATE_MEETING_TABLE = `
    CREATE TABLE IF NOT EXISTS Meeting (
      meeting_no SMALLINT PRIMARY KEY,
      meeting_title VARCHAR(50),
      starting_time TIMESTAMP(0),
      ending_time TIMESTAMP(0),
      room_no SMALLINT,
      CONSTRAINT fk_room_no FOREIGN KEY (room_no) REFERENCES Room(room_no)
    )`;

  const invitees = [
    {
      invitee_name: "Ben",
      invited_by: "Henri",
    },
    {
      invitee_name: "Henri",
      invited_by: null,
    },
    {
      invitee_name: "Alice",
      invited_by: "Henri",
    },
    {
      invitee_name: "Charlie",
      invited_by: "Ben",
    },
    {
      invitee_name: "Diana",
      invited_by: "Alice",
    },
  ];

  const rooms = [
    {
      room_no: 101,
      room_name: "Amsterdam",
      floor_number: 1,
    },
    {
      room_no: 102,
      room_name: "Rotterdam",
      floor_number: 1,
    },
    {
      room_no: 201,
      room_name: "Utrecht",
      floor_number: 2,
    },
    {
      room_no: 202,
      room_name: "The Hague",
      floor_number: 2,
    },
    {
      room_no: 203,
      room_name: "Eindhoven",
      floor_number: 2,
    },
  ];

  const meetings = [
    {
      meeting_no: 1,
      meeting_title: "Team Standup",
      starting_time: new Date("2025-09-01T09:00:00"),
      ending_time: new Date("2025-09-01T09:30:00"),
      room_no: 101,
    },
    {
      meeting_no: 2,
      meeting_title: "Project Kickoff",
      starting_time: new Date("2025-09-01T10:00:00"),
      ending_time: new Date("2025-09-01T11:30:00"),
      room_no: 201,
    },
    {
      meeting_no: 3,
      meeting_title: "Code Review",
      starting_time: new Date("2025-09-02T14:00:00"),
      ending_time: new Date("2025-09-02T15:30:00"),
      room_no: 202,
    },
    {
      meeting_no: 4,
      meeting_title: "Sprint Planning",
      starting_time: new Date("2025-09-03T13:00:00"),
      ending_time: new Date("2025-09-03T15:00:00"),
      room_no: 102,
    },
    {
      meeting_no: 5,
      meeting_title: "Retrospective",
      starting_time: new Date("2025-09-04T15:00:00"),
      ending_time: new Date("2025-09-04T16:30:00"),
      room_no: 203,
    },
  ];

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create tables
    await client.query(CREATE_INVITEE_TABLE);
    console.log("Invitee table created successfully");

    await client.query(CREATE_ROOM_TABLE);
    console.log("Room table created successfully");

    await client.query(CREATE_MEETING_TABLE);
    console.log("Meeting table created successfully");

    // Insert invitees
    for (const invitee of invitees) {
      const insertQuery = `
        INSERT INTO invitee (invitee_name, invited_by)
        VALUES ($1, $2)
      `;
      const values = [invitee.invitee_name, invitee.invited_by];

      await client.query(insertQuery, values);
      console.log(`Inserted invitee: ${invitee.invitee_name}`);
    }

    // Insert rooms
    for (const room of rooms) {
      const insertQuery = `
        INSERT INTO Room (room_no, room_name, floor_number)
        VALUES ($1, $2, $3)
        ON CONFLICT (room_no) DO NOTHING
      `;
      const values = [room.room_no, room.room_name, room.floor_number];

      await client.query(insertQuery, values);
      console.log(`Inserted room: ${room.room_name}`);
    }

    // Insert meetings
    for (const meeting of meetings) {
      const insertQuery = `
        INSERT INTO Meeting (meeting_no, meeting_title, starting_time, ending_time, room_no)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (meeting_no) DO NOTHING
      `;
      const values = [
        meeting.meeting_no,
        meeting.meeting_title,
        meeting.starting_time,
        meeting.ending_time,
        meeting.room_no,
      ];

      await client.query(insertQuery, values);
      console.log(`Inserted meeting: ${meeting.meeting_title}`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase();
