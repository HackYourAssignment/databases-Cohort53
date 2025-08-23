// Import the Client class from the pg package
const { Client } = require('pg');
async function main(){
const client = new Client({
  user: 'hyfuser', // Your PostgreSQL username
  host: 'localhost', // Your database server address
  database: 'meetup', // The database you just created
  password: 'hyfpassword', // Replace with your actual password
  port: 5432, // The default PostgreSQL port
});
try{
    await client.connect();
    console.log("Connected successfully to the database");
    const createInviteeTableQuery=`CREATE TABLE IF NOT EXISTS invitee(
    invitee_no SERIAL PRIMARY KEY,
    invitee_name VARCHAR(255) NOT NULL,
    INVITEE_BY VARCHAR(255) NOT NULL);`;

    const creatRoomTableQuery=`CREATE TABLE IF NOT EXISTS room(
    room_no SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    floor_number INT NOT NULL);`;

    const creatMeetingTableQuery=`CREATE TABLE IF NOT EXISTS meeting(
    meeting_no SERIAL PRIMARY KEY,
    meeting_title VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    room_no INT NOT NULL REFERENCES room(room_no));`;

   await client.query(createInviteeTableQuery);
    await client.query(creatRoomTableQuery);
     await client.query(creatMeetingTableQuery);
    console.log("Tables created successfully");

    const insertInviteeQuery = `
      INSERT INTO Invitee (invitee_name,INVITEE_BY ) VALUES
      ('Alice', 'John'),
      ('Bob', 'Jane'),
      ('Charlie', 'John'),
      ('David', 'Alice'),
      ('Eve', 'Bob');
    `;
    const insertRoomQuery = `
      INSERT INTO room (room_name, floor_number) VALUES
      ('Boardroom A', 1),
      ('Conference Room 201', 2),
      ('Boardroom B', 1),
      ('Huddle Room 301', 3),
      ('Main Hall', 1);
    `;
    const insertMeetingsQuery = `
        INSERT INTO Meeting (meeting_title, start_time, end_time, room_no) VALUES
        ('Project Kickoff', '2025-08-25 09:00:00', '2025-08-25 10:30:00', 1),
        ('Marketing Strategy', '2025-08-26 11:00:00', '2025-08-26 12:00:00', 3),
        ('Quarterly Review', '2025-08-27 14:00:00', '2025-08-27 15:00:00', 5),
        ('Team Sync', '2025-08-28 10:00:00', '2025-08-28 10:30:00', 2),
        ('Client Demo', '2025-08-29 16:00:00', '2025-08-29 17:00:00', 4);
        `;
    await client.query(insertInviteeQuery);
    await client.query(insertRoomQuery);
    await client.query(insertMeetingsQuery);
    console.log("Sample data inserted successfully");


}catch(err){
    console.error("Error during database operation:", err);
}
finally{
    await client.end();
    console.log("Database connection closed")
}
}
main();