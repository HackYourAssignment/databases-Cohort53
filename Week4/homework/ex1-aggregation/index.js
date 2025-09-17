require("dotenv").config({ path: "D:/HYF/databases-Cohort53/Week4/.env" });

const { MongoClient } = require("mongodb");

async function getTotalPopulationPerYear(collection, country) {
  return await collection
    .aggregate([
      { $match: { Country: country } },
      {
        $group: {
          _id: "$Year",
          countPopulation: { $sum: { $add: ["$M", "$F"]} },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();
}

async function getContinentsInfoWithTotalPopulation(collection, year, age) {
  return await collection
    .aggregate([
      { $match: { Year: year, Age: age } },
      { $addFields: { TotalPopulation: { $add: ["$M", "$F"] } } },
    ])
    .toArray();
}

async function main() {
  const uri = process.env.MONGODB_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    // await client.db("admin").command({ ping: 1 });

    const collection = client
      .db("databaseWeek4")
      .collection("population_pyramid");

    const country = "Netherlands";
    const populationByYear = await getTotalPopulationPerYear(
      collection,
      country
    );
    console.log("Total population per year for", country, populationByYear);

    const year = 2020;
    const age = "100+";
    const continentsInfo = await getContinentsInfoWithTotalPopulation(
      collection,
      year,
      age
    );
    console.log(
      `Continents info for year ${year} and age ${age}:`,
      continentsInfo
    );
  } finally {
    await client.close();
  }
}
main().catch(console.error);
