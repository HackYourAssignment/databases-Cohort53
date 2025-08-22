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
  const CREATE_Invitee_TABLE = `
    CREATE TABLE IF NOT EXISTS Invitee (
      invitee_no INTEGER PRIMARY KEY,
      invitee_name VARCHAR(50) UNIQUE NOT NULL,
      invited_by VARCHAR(50)
    )`;

  const CREATE_Room_TABLE = `
    CREATE TABLE IF NOT EXISTS Room (
      room_no INTEGER PRIMARY KEY,
      room_name VARCHAR(50),
      floor_number INTEGER
    )`;

  const CREATE_Meeting_TABLE = `
    CREATE TABLE IF NOT EXISTS Meeting (
      meeting_no INTEGER PRIMARY KEY,
      meeting_title VARCHAR(50),
      starting_time DATE,
      ending_time DATE,
      room_no REFERENCES Room(room_no)
    )`;

  const invitees = [
    {
      invitee_no: 1,
      invitee_name: "Ben",
      invited_by: "Henri",
    },
    {
      invitee_no: 2,
      invitee_name: "Henri",
      invited_by: null,
    },
    {
      invitee_no: 3,
      invitee_name: "Alice",
      invited_by: "Henri",
    },
    {
      invitee_no: 4,
      invitee_name: "Charlie",
      invited_by: "Ben",
    },
    {
      invitee_no: 5,
      invitee_name: "Diana",
      invited_by: "Alice",
    },
  ];

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    // Create tables
    await client.query(CREATE_Invitee_TABLE);
    console.log("Invitee table created successfully");

    await client.query(CREATE_Room_TABLE);
    console.log("Room table created successfully");

    // Insert invitees
    for (const invitee of invitees) {
      const insertQuery = `
        INSERT INTO invitee (invitee_no, invitee_name, invited_by)
        VALUES ($1, $2, $3)
        ON CONFLICT (invitee_no) DO NOTHING
      `;
      const values = [
        invitee.invitee_no,
        invitee.invitee_name,
        invitee.invited_by,
      ];

      await client.query(insertQuery, values);
      console.log(`Inserted invitee: ${invitee.invitee_name}`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase();
