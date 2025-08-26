const { createPool } = require("../db-config");
const pool = createPool("meetup");

 async function insertInvitee(invitee_name, invited_by) {
  const query = `INSERT INTO Invitee (invitee_name,invited_by )
    VALUES($1,$2)
    RETURNING *`;

  try {
    const response = await pool.query(query, [invitee_name, invited_by]);
    console.log(response.rows[0]);
    return response.rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function insertRoom(room_name, floor_number) {
  const query = `INSERT INTO Room (room_name, floor_number)
    VALUES($1,$2)
    RETURNING *`;
  try {
    const response = await pool.query(query, [room_name, floor_number]);
    console.log(response.rows[0]);
    return response.rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function insertMeeting(
  meeting_title,
  starting_time,
  ending_time,
  room_no
) {
  const query = `INSERT INTO Meeting(meeting_title, starting_time,ending_time, room_no)
    VALUES($1,$2, $3, $4)
    RETURNING *`;
  try {
    const response = await pool.query(query, [
      meeting_title,
      starting_time,
      ending_time,
      room_no,
    ]);
    console.log(response.rows[0]);
    return response.rows[0];
  } catch (error) {
    console.error(error);
  }
}



module.exports = {
  insertInvitee,
  insertRoom,
  insertMeeting,
};
