import { connectDB } from "./connectDatabase.js";

async function runQueries() {
  const client = await connectDB("recipes");

  try {
    const res1 = await client.query(`
      SELECT r.name
      FROM recipes r
      JOIN recipe_category rc ON r.recipe_id = rc.recipe_id
      JOIN categories c ON rc.category_id = c.category_id
      WHERE c.name = 'Vegetarian'
    `);
    console.log("Vegetarian recipes:", res1.rows);

    const res2 = await client.query(`
      SELECT r.name
      FROM recipes r
      JOIN recipe_category rc ON r.recipe_id = rc.recipe_id
      JOIN categories c ON rc.category_id = c.category_id
      WHERE c.name = 'No-Bake'
    `);
    console.log("No-Bake Cakes:", res2.rows);

    const res3 = await client.query(`
      SELECT r.name
      FROM recipes r
      JOIN recipe_category rc ON r.recipe_id = rc.recipe_id
      JOIN categories c ON rc.category_id = c.category_id
      WHERE c.name IN ('Vegan','Japanese')
    `);
    console.log("Vegan or Japanese recipes:", res3.rows);
  } catch (err) {
    console.error("Error running queries:", err);
  } finally {
    await client.end();
  }
}

runQueries();
