
const dotenv = require("dotenv").config()
const { MongoClient, ServerApiVersion } = require("mongodb");

const { seedDatabase } = require("./seedDatabase.js");

async function createEpisodeExercise(client) {

const bobRossEpisode = client.db("databaseWeek3").collection("bob_ross_episodes")
const newEpisod = {
  episode: "S09E13",
  title: "MOUNTAIN HIDE-AWAY",
  elements: ["CIRRUS", "CLOUDS", "CONIFER", "DECIDIOUS", "GRASS", "MOUNTAIN", "MOUNTAINS", "RIVER", "SNOWY_MOUNTAIN", "TREE", "TREES"]
}
 const result= await bobRossEpisode.insertOne(newEpisod)

  console.log(
    `Created season 9 episode 13 and the document got the id ${result.insertedId}`
  );
}

async function findEpisodesExercises(client) {

  const bobRossEpisode = client.db("databaseWeek3").collection("bob_ross_episodes")
  const result= await bobRossEpisode.findOne({episode: "S02E02"})
  console.log(
    `The title of episode 2 in season 2 is ${result.title}`
  );

   const blackRive = await bobRossEpisode.findOne({title:"BLACK RIVER"})
  // Find the season and episode number of the episode called "BLACK RIVER" [Should be: S02E06]

  console.log(
    `The season and episode number of the "BLACK RIVER" episode is ${blackRive.episode}`
  );

  // Find all of the episode titles where Bob Ross painted a CLIFF [Should be: NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL]
  const allEpisode = await bobRossEpisode.find({elements:"CLIFF"}, {projection:{_id: 0, title: 1}}).toArray();
  console.log(
    `The episodes that Bob Ross painted a CLIFF are ${allEpisode.map((ep)=> ep.title).join(", ")}`
  );

  // Find all of the episode titles where Bob Ross painted a CLIFF and a LIGHTHOUSE [Should be: NIGHT LIGHT]

const cliffLighthouse = await bobRossEpisode.find({ elements: { $all: ["CLIFF", "LIGHTHOUSE"] } },{ projection: { title: 1, _id: 0 } }).toArray();

console.log(
`The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are: ${cliffLighthouse .map((ep) => ep.title) .join(", ")}`
);

}
async function updateEpisodeExercises(client) {
  const bobRossEpisode = client.db("databaseWeek3").collection("bob_ross_episodes")
  const filter = { episode: "S30E13" };
  const updateValue = { $set: { title: "BLUE RIDGE FALLS" } }
 
  const result = await bobRossEpisode.updateOne(filter,updateValue )
  

  // Episode 13 in season 30 should be called BLUE RIDGE FALLS, yet it is called BLUE RIDGE FALLERS now. Fix that

  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${result.modifiedCount} episodes`
  );

  // Unfortunately we made a mistake in the arrays and the element type called 'BUSHES' should actually be 'BUSH' as sometimes only one bush was painted.
  // Update all of the documents in the collection that have `BUSHES` in the elements array to now have `BUSH`
  // It should update 120 episodes!
  const filter1 = { elements: "BUSHES" }
  const updateValue1 = { $set: { "elements.$": "BUSH" } }

  const result1 = await bobRossEpisode.updateMany(filter1, updateValue1);

  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${result1.modifiedCount} episodes`
  );
}

async function deleteEpisodeExercise(client) {
  const bobRossEpisode = client.db("databaseWeek3").collection("bob_ross_episodes")
  /**
   * It seems an errand episode has gotten into our data.
   * This is episode 14 in season 31. Please remove it and verify that it has been removed!
   */
  const filter = { episode: "S31E14" }
  const deleteResult = await bobRossEpisode.deleteOne(filter);

  console.log(
    `Ran a command to delete episode and it deleted ${deleteResult.deletedCount} episodes`
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
