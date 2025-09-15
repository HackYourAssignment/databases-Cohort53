import { MongoClient } from "mongodb";
import dotenv from "dotenv" 

dotenv.config()

const url = process.env.MONGODB_URL
if(!url) throw new Error("MONGODB_URL is not set in .env")
const client = new MongoClient(url);
const db = client.db("databaseWeek4");
const collection = db.collection("week4Exercises");

  /*Write a function that will return the array of the total population (M + F over all age groups) for a given Country per year. 
    The result should look something like this, these are the values for Netherlands:*/

async function getTotalPopulationByCountryPerYear() {
  try {
    // Example query: find first 1 document
    const docs = await collection.find().limit(1).toArray();
    console.log(docs);

    const pipeline = [
      { $match: { Country: "Netherlands" } },
      {
        $group: {
          _id: "$Year",
          countPopulation: { $sum: { $add: ["$M", "$F"] } },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    console.log(result);

    const formated = result.map((item) => {
      return {
        Year: item._id,
        countPopulation: item.countPopulation,
      };
    });
    console.table(formated);
  } catch (err) {
    console.error(err);
  }
}

/*Write a function that will return all the information of each continent for a given Year 
and Age field but add a new field TotalPopulation that will be the addition of M and F. 
For example, if I would give 2020 for the Year and 100+ for the Age it should return something like this:*/
async function getContinentPopulation(year, age) {
  try {
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
        $match: { Year: year, Age: age, Country: { $in: continents } },
      },
      {
        $addFields: {
          TotalPopulation: { $add: ["$M", "$F"] },
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    console.error("Error", error);
  }
}

async function main() {
  try {
    await client.connect();
    console.log("Connected to local MongoDB");
    await getTotalPopulationByCountryPerYear();

    const data = await getContinentPopulation(2020, "100+");
    console.log(data);
    console.table(data);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
