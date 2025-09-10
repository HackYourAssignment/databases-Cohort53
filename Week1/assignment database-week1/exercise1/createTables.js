const { createPool } = require("../db-config");

 async function createTables() {
  const pool = createPool("meetup");

  const tables = [
    `CREATE TABLE IF NOT EXISTS Invitee (
      invitee_no SERIAL PRIMARY KEY,
      invitee_name VARCHAR(100) NOT NULL,
      invited_by VARCHAR(100) NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS Room (
      room_no SERIAL PRIMARY KEY,
      room_name VARCHAR(50) NOT NULL,
      floor_number INT
    )`,

    `CREATE TABLE IF NOT EXISTS Meeting (
  meeting_no SERIAL PRIMARY KEY,
  meeting_title VARCHAR(200) NOT NULL,
  starting_time TIMESTAMP NOT NULL,
  ending_time TIMESTAMP NOT NULL,
  room_no INT,
  FOREIGN KEY (room_no) REFERENCES Room(room_no)
);
`
  ];

  try {
    for (const query of tables) {
      await pool.query(query);
      console.log("Table created successfully:", query.split(" ")[5]); // log table name
    }
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

module.exports = createTables
