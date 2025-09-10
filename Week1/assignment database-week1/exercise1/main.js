const createDatabase = require("./createDb");
const createTables = require("./createTables");
const { insertInvitee, insertRoom, insertMeeting} = require("./insetInfo");
const showData = require("./showData");

async function main() {
  try {
    await createDatabase("meetup");
    await createTables();

    await insertInvitee("Yahya", "Mohammed")
    await insertRoom("Blue Room", 3);
    const room = await insertRoom("Blue Room", 3);
    await insertMeeting(
      "Weekly Section Planning",
      "2025-08-25 11:00:00",
      "2025-08-25 14:00:00",
      room.room_no
    );
 
    await showData();
    console.log("All steps completed successfully!");
  } catch (error) {
    console.error("Error", error);
  }
}
main();
