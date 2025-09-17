require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const DB = "databaseWeek4";
const COLL = "populations";

async function totalPopulationPerYear(client, country) {
  const col = client.db(DB).collection(COLL);
  const pipeline = [
    { $match: { Country: country } },
    {
      $addFields: {
        Year: { $toInt: "$Year" },
        M: { $toLong: "$M" },
        F: { $toLong: "$F" },
      },
    },
    {
      $group: {
        _id: "$Year",
        countPopulation: { $sum: { $add: ["$M", "$F"] } },
      },
    },
    { $sort: { _id: 1 } },
  ];
  return col.aggregate(pipeline).toArray();
}

async function continentsForYearAge(client, year, age) {
  const col = client.db(DB).collection(COLL);
  const continents = [
    "AFRICA",
    "ASIA",
    "EUROPE",
    "LATIN AMERICA AND THE CARIBBEAN",
    "NORTHERN AMERICA",
    "OCEANIA",
  ];
  const pipeline = [
    {
      $match: {
        Country: { $in: continents },
        Year: { $in: [year, String(year)] },
        Age: age,
      },
    },
    {
      $addFields: {
        Year: { $toInt: "$Year" },
        M: { $toLong: "$M" },
        F: { $toLong: "$F" },
        TotalPopulation: { $add: [{ $toLong: "$M" }, { $toLong: "$F" }] },
      },
    },
    // { $sort: { Country: 1 } } // optional
  ];
  return col.aggregate(pipeline).toArray();
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URL, {
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();
  try {
    const nl = await totalPopulationPerYear(client, "Netherlands");
    console.log(nl);

    const y2020 = await continentsForYearAge(client, 2020, "100+");
    console.log(y2020);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
