const { MongoClient } = require("mongodb");
const fs = require("fs");
const { parse } = require("csv-parse");

const url = "mongodb://localhost:27017";
const dbName = "databaseWeek4";
const collectionName = "population";
const csvFilePath = "./population_pyramid_1950-2022.csv";

async function importCSV() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});

    const records = [];
    fs.createReadStream(csvFilePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row) => {
        records.push({
          Country: row.Country,
          Year: parseInt(row.Year),
          Age: row.Age,
          M: parseInt(row.M),
          F: parseInt(row.F),
        });
      })
      .on("end", async () => {
        await collection.insertMany(records);
        console.log(`Imported ${records.length} records successfully`);
        await client.close();
      })
      .on("error", (err) => {
        console.error("Error reading CSV:", err);
      });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

importCSV();
