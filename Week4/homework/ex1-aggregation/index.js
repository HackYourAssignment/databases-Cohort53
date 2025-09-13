import { MongoClient } from "mongodb";
import "dotenv/config";
const clientMongo = new MongoClient(process.env.MONGODB_URL);
import fs from "fs";
import csv from "csv-parser";

async function processCSV(fileName) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(fileName)
      .pipe(csv())
      .on("data", (row) => data.push(row))
      .on("end", () => resolve(data))
      .on("error", (err) => reject(err));
  });
}

async function main() {
  try {
    await clientMongo.connect();
    const db = clientMongo.db("databaseWeek4");
    const collection = db.collection("population_pyramid");
    let data = await processCSV(
      "./Week4/homework/ex1-aggregation/population_pyramid_1950-2022.csv"
    );
    await collection.insertMany(data);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await clientMongo.close();
    console.log("Connection to MongoDB closed");
  }
}

main();
