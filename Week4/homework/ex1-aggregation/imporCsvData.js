import fs from "fs";
import csv from "csv-parser";
import { connectToDatabase } from "./connectDatabase.js";

export async function importCSV(path = "./population_pyramid_1950-2022.csv") {
  const db = await connectToDatabase();
  const collection = db.collection("populations");

  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => {
        data.Year = Number(data.Year);
        data.M = Number(data.M);
        data.F = Number(data.F);
        results.push(data);
      })
      .on("end", async () => {
        try {
          await collection.insertMany(results);
          console.log("✅ CSV imported successfully");
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => reject(err));
  });
}
