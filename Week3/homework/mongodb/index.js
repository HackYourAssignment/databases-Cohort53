const { MongoClient, ServerApiVersion } = require("mongodb");
const { seedDatabase } = require("./seedDatabase.js");

const DB_NAME = "databaseWeek3";
const COLL_NAME = "bob_ross_episodes";

// CREATE
async function createEpisodeExercise(client) {
  const col = client.db(DB_NAME).collection(COLL_NAME);

  const doc = {
    episode: "S09E13",
    title: "MOUNTAIN HIDE-AWAY",
    elements: [
      "CIRRUS",
      "CLOUDS",
      "CONIFER",
      "DECIDIOUS",
      "GRASS",
      "MOUNTAIN",
      "MOUNTAINS",
      "RIVER",
      "SNOWY_MOUNTAIN",
      "TREE",
      "TREES",
    ],
  };

  const { insertedId } = await col.insertOne(doc);
  console.log(
    `Created season 9 episode 13 and the document got the id ${insertedId}`
  );
}

// READ
async function findEpisodesExercises(client) {
  const col = client.db(DB_NAME).collection(COLL_NAME);

  // S02E02 -> WINTER SUN
  const ep2s2 = await col.findOne({ episode: "S02E02" });
  console.log(`The title of episode 2 in season 2 is ${ep2s2.title}`);

  // BLACK RIVER -> S02E06
  const blackRiver = await col.findOne({ title: "BLACK RIVER" });
  console.log(
    `The season and episode number of the "BLACK RIVER" episode is ${blackRiver.episode}`
  );

  // episodes with CLIFF
  const cliffDocs = await col.find({ elements: "CLIFF" }).toArray();
  const cliffTitles = cliffDocs.map((d) => d.title).join(", ");
  console.log(`The episodes that Bob Ross painted a CLIFF are ${cliffTitles}`);

  // episodes with CLIFF and LIGHTHOUSE
  const cliffLighthouseDocs = await col
    .find({ elements: { $all: ["CLIFF", "LIGHTHOUSE"] } })
    .toArray();
  const cliffLighthouseTitles = cliffLighthouseDocs
    .map((d) => d.title)
    .join(", ");
  console.log(
    `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${cliffLighthouseTitles}`
  );
}

// UPDATE
async function updateEpisodeExercises(client) {
  const col = client.db(DB_NAME).collection(COLL_NAME);

  // S30E13 -> BLUE RIDGE FALLS
  const updTitle = await col.updateOne(
    { episode: "S30E13" },
    { $set: { title: "BLUE RIDGE FALLS" } }
  );
  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${updTitle.modifiedCount} episodes`
  );

  // BUSHES -> BUSH
  const updBushes = await col.updateMany(
    { elements: "BUSHES" },
    { $set: { "elements.$": "BUSH" } }
  );
  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${updBushes.modifiedCount} episodes`
  );
}

// DELETE
async function deleteEpisodeExercise(client) {
  const col = client.db(DB_NAME).collection(COLL_NAME);

  const del = await col.deleteOne({ episode: "S31E14" });
  console.log(
    `Ran a command to delete episode and it deleted ${del.deletedCount} episodes`
  );
}

async function main() {
  if (!process.env.MONGODB_URL) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to load it?`
    );
  }

  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed the database
    await seedDatabase(client);

    // CRUD
    await createEpisodeExercise(client);
    await findEpisodesExercises(client);
    await updateEpisodeExercises(client);
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
