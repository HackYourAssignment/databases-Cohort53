
const showData = require("./world.js");

async function main() {
  try {
   
    await showData();
    console.log("All steps completed successfully!");
  } catch (error) {
    console.error("Error", error);
  }
}
main();