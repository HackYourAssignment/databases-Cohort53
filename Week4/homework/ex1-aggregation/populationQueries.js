import { connectToDatabase } from "./connectDatabase.js";

// Total population per year for a country
export async function countryPopulation(country) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("populations");
    const result = await collection
      .aggregate([
        { $match: { Country: country } },
        {
          $group: {
            _id: "$Year",
            countPopulation: { $sum: { $add: ["$M", "$F"] } },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();
    return result;
  } catch (err) {
    console.error("❌ Error in countryPopulation:", err);
    throw err;
  }
}

// Continents population with TotalPopulation
export async function getContinentsPopulationByYearAndAge(year, age) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("populations");

    const continents = [
      "AFRICA",
      "ASIA",
      "EUROPE",
      "OCEANIA",
      "NORTHERN AMERICA",
      "LATIN AMERICA AND THE CARIBBEAN",
      "ANTARCTICA",
    ];

    const result = await collection
      .aggregate([
        {
          $match: {
            Year: year,
            Age: age,
            Country: { $in: continents },
          },
        },
        {
          $group: {
            _id: "$Country",
            Year: { $first: "$Year" },
            Age: { $first: "$Age" },
            M: { $sum: "$M" },
            F: { $sum: "$F" },
          },
        },
        {
          $addFields: {
            TotalPopulation: { $add: ["$M", "$F"] },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return result;
  } catch (err) {
    console.error("❌ Error in getContinentsPopulationByYearAndAge:", err);
    throw err;
  }
}
