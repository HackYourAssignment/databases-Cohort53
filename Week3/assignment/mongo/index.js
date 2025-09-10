import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "databaseWeek3";
const collName = process.env.MONGODB_COLLECTION || "bob_ross_episodes";

async function run() {
  // 1) Connect
  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const coll = db.collection(collName);

    // 2) C — Create (insertOne)
    const demoDoc = {
      title: "Demo Episode",
      elements: ["mountain", "tree", "lake"],
      season: 99,
      episode: 1,
    };
    const insertRes = await coll.insertOne(demoDoc);
    console.log("Inserted ID:", insertRes.insertedId.toString());

    // 3) R — Read (find)
    const mountains = await coll
      .find({ elements: "mountain" })
      .project({ title: 1, season: 1, episode: 1, _id: 0 })
      .limit(5)
      .toArray();
    console.log("Sample with 'mountain':", mountains);

    // 4) U — Update (updateMany)
    const upd = await coll.updateMany(
      { season: { $gte: 20 } },
      { $set: { hasVintage: true } }
    );
    console.log("Updated docs:", upd.modifiedCount);

    // 5) D — Delete (deleteOne) — remove demo
    const del = await coll.deleteOne({ _id: insertRes.insertedId });
    console.log("Deleted demo:", del.deletedCount);
  } finally {
    // 6) Close
    await client.close();
  }
}

run().catch((e) => {
  console.error("Mongo error:", e.message);
  process.exit(1);
});
