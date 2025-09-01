import { setupDatabase } from './connectDatabase.js';
import { main1 } from './exercise1_keys.js';
import { main2 } from './exercise2_relationships.js';
import { main3 } from './exercise3_joins.js';
import { main4 } from './exercise4_aggregates.js';

async function main() {
  const client1 = await setupDatabase(true);
  await client1.end();

  // 3.1. Exercise 1: Keys
  await main1();
  // 3.2. Exercise 2: Relationships
  await main2();
  // 3.3. Exercise 3: Joins
  await main3();
  // 3.4 Exercise 4: Aggregate Functions
  await main4();
  console.log('All exercises completed successfully!');
}

main();