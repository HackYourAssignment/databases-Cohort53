const { createPool } = require("../db-config");
const pool = createPool("meetup");

async function showData() {
  const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  try {
    const roomResult = await pool.query("SELECT * FROM Room");
    console.log(roomResult.rows);
    const inviteeResult = await pool.query("SELECT * FROM Invitee");
    console.log(inviteeResult.rows);
    const meetingResult = await pool.query("SELECT * FROM Meeting");
    console.log(meetingResult.rows);

    const allTablesResult = await pool.query(query); // All tables
    console.log(allTablesResult.rows);
    const tables = allTablesResult.rows.map((row) => row.table_name);
    console.log(tables);
    for (const table of tables) {
      console.log(`\n Table: ${table}`);
      const finalResult = await pool.query(`SELECT * FROM ${table}`);
      console.table(finalResult.rows);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    await pool.end();
  }
}
module.exports = showData
