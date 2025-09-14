import { importCSV } from "./imporCsvData.js";
import {
  countryPopulation,
  getContinentsPopulationByYearAndAge,
} from "./populationQueries.js";
import { closeDatabase } from "./connectDatabase.js";

async function main() {
  try {
    // Import CSV data into the database
    await importCSV();

    // Netherlands population per year
    const netherlandsPopulation = await countryPopulation("Netherlands");
    console.log("✅ Netherlands population per year:");
    console.log(netherlandsPopulation);

    // Continents population for year & age
    const continentsPopulation = await getContinentsPopulationByYearAndAge(
      2020,
      "100+"
    );
    console.log("✅ Continents population for 2020 and age 100+:");
    console.log(continentsPopulation);
  } catch (err) {
    console.error("❌ Error in main:", err);
  } finally {
    await closeDatabase();
  }
}

main();
