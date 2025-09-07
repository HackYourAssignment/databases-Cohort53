const { MongoClient, ServerApiVersion } = require("mongodb");
const { config: configDotenv } = require("dotenv");
configDotenv({ silent: true });
const { seedDatabase } = require("./seedDatabase.js");
let req;
let res;

async function createEpisodeExercise(client) {
  const bobRossCollection = await client
    .db("databaseWeek3")
    .collection("bob_ross_episodes");

  req = {
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

  res = await bobRossCollection.insertOne(req);

  console.log(
    `Created season 9 episode 13 and the document got the id ${res.insertedId}`
  );
}

async function findEpisodesExercises(client) {
  const bobRossCollection = await client
    .db("databaseWeek3")
    .collection("bob_ross_episodes");
  req = { episode: "S02E02" };
  res = await bobRossCollection.findOne(req);
  // Find the title of episode 2 in season 2 [Should be: WINTER SUN]
  console.log(`The title of episode 2 in season 2 is ${res.title}`);

  req = { title: "BLACK RIVER" };
  res = await bobRossCollection.findOne(req);
  // Find the season and episode number of the episode called "BLACK RIVER" [Should be: S02E06]
  console.log(
    `The season and episode number of the "BLACK RIVER" episode is ${res.episode}`
  );

  req = { elements: "CLIFF" };
  res = await bobRossCollection.find(req).toArray();
  // Find all of the episode titles where Bob Ross painted a CLIFF [Should be: NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL]
  console.log(
    `The episodes that Bob Ross painted a CLIFF are ${res
      .map((item) => item.title)
      .join(", ")}`
  );

  req = { elements: { $all: ["CLIFF", "LIGHTHOUSE"] } };
  res = await bobRossCollection.find(req).toArray();
  // Find all of the episode titles where Bob Ross painted a CLIFF and a LIGHTHOUSE [Should be: NIGHT LIGHT]
  console.log(
    `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${res
      .map((item) => item.title)
      .join(", ")}`
  );
}

async function updateEpisodeExercises(client) {
  const bobRossCollection = await client
    .db("databaseWeek3")
    .collection("bob_ross_episodes");

  bobRossCollection.updateOne(
    { episode: "S30E13" },
    { $set: { title: "BLUE RIDGE FALLS" } }
  );
  req = { episode: "S30E13" };
  res = await bobRossCollection.findOne(req);
  // Episode 13 in season 30 should be called BLUE RIDGE FALLS.
  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${res.title} episodes`
  );

  res = await bobRossCollection.updateMany({ elements: "BUSHES" }, [
    {
      $set: {
        elements: {
          $map: {
            input: "$elements",
            as: "el",
            in: {
              $cond: [{ $eq: ["$$el", "BUSHES"] }, "BUSH", "$$el"],
            },
          },
        },
      },
    },
  ]);
  // It should update 120 episodes!
  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${res.modifiedCount} episodes`
  );
}

async function deleteEpisodeExercise(client) {
  /**
   * It seems an errand episode has gotten into our data.
   * This is episode 14 in season 31. Please remove it and verify that it has been removed!
   */

  console.log(
    `Ran a command to delete episode and it deleted ${"TODO: fill in variable here"} episodes`
  );
}

async function main() {
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }
  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed our database
    await seedDatabase(client);

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    // Always close the connection at the end
    client.close();
  }
}

main();

/**
 * In the end the console should read something like this: 

Created season 9 episode 13 and the document got the id 625e9addd11e82a59aa9ff93
The title of episode 2 in season 2 is WINTER SUN
The season and episode number of the "BLACK RIVER" episode is S02E06
The episodes that Bob Ross painted a CLIFF are NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL
The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are NIGHT LIGHT
Ran a command to update episode 13 in season 30 and it updated 1 episodes
Ran a command to update all the BUSHES to BUSH and it updated 120 episodes
Ran a command to delete episode and it deleted 1 episodes
 
*/
