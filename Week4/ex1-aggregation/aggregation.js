const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'databaseWeek4';
const collectionName = 'population';

// Function to get total population (M + F) for a given country per year
async function getTotalPopulationByCountry(country) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection
      .aggregate([
        { $match: { Country: country } },
        {
          $group: {
            _id: '$Year',
            countPopulation: { $sum: { $add: ['$M', '$F'] } },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return result;
  } catch (err) {
    console.error('Error executing getTotalPopulationByCountry:', err);
    throw err;
  } finally {
    await client.close();
  }
}

// Function to get continent data for a given year and age with TotalPopulation
async function getContinentDataByYearAndAge(year, age) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection
      .aggregate([
        {
          $match: {
            Year: year,
            Age: age,
            Country: {
              $in: [
                'AFRICA',
                'ASIA',
                'EUROPE',
                'LATIN AMERICA AND THE CARIBBEAN',
                'NORTHERN AMERICA',
                'OCEANIA',
              ],
            },
          },
        },
        {
          $project: {
            Country: 1,
            Year: 1,
            Age: 1,
            M: 1,
            F: 1,
            TotalPopulation: { $add: ['$M', '$F'] },
          },
        },
      ])
      .toArray();

    return result;
  } catch (err) {
    console.error('Error executing getContinentDataByYearAndAge:', err);
    throw err;
  } finally {
    await client.close();
  }
}

async function main() {
  try {
    // Test total population for Netherlands
    const countryResult = await getTotalPopulationByCountry('Netherlands');
    console.log('Total Population for Netherlands:');
    console.log(JSON.stringify(countryResult, null, 2));

    // Test continent data for Year 2020, Age 100+
    const continentResult = await getContinentDataByYearAndAge(2020, '100+');
    console.log('\nContinent Data for Year 2020, Age 100+:');
    console.log(JSON.stringify(continentResult, null, 2));
  } catch (err) {
    console.error('Error in main:', err);
  }
}

main();