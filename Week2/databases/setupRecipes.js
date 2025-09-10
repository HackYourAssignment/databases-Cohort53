import pkg from "pg";
const { Client } = pkg;

const defaultClient = new Client({
  user: "hyfuser",
  host: "localhost",
  database: "postgres",
  password: "hyfpassword",
  port: 5432,
});

async function setupDatabase() {
  try {
    await defaultClient.connect();

    await defaultClient.query(`DROP DATABASE IF EXISTS recipes;`);
    await defaultClient.query(`CREATE DATABASE recipes;`);
    console.log('Database "recipes" created.');
    await defaultClient.end();

    const client = new Client({
      user: "hyfuser",
      host: "localhost",
      database: "recipes",
      password: "hyfpassword",
      port: 5432,
    });

    await client.connect();
    console.log("Connected to database: recipes");

    await client.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        recipe_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        ingredient_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS steps (
        step_id SERIAL PRIMARY KEY,
        description TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS recipe_category (
        recipe_id INT,
        category_id INT,
        PRIMARY KEY (recipe_id, category_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS recipe_ingredient (
        recipe_id INT,
        ingredient_id INT,
        quantity VARCHAR(50),
        PRIMARY KEY (recipe_id, ingredient_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS recipe_step (
        recipe_id INT,
        step_id INT,
        step_order INT NOT NULL,
        PRIMARY KEY (recipe_id, step_id),
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
        FOREIGN KEY (step_id) REFERENCES steps(step_id) ON DELETE CASCADE
      );
    `);

    const categories = [
      "Cake",
      "No-Bake",
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Japanese",
    ];
    for (let cat of categories) {
      await client.query(
        `INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING`,
        [cat]
      );
    }

    const ingredients = [
      "Condensed milk",
      "Cream Cheese",
      "Lemon Juice",
      "Pie Crust",
      "Cherry Jam",
      "Brussels Sprouts",
      "Sesame seeds",
      "Pepper",
      "Salt",
      "Olive oil",
      "Macaroni",
      "Butter",
      "Flour",
      "Milk",
      "Shredded Cheddar cheese",
      "Eggs",
      "Soy sauce",
      "Sugar",
    ];
    for (let ing of ingredients) {
      await client.query(
        `INSERT INTO ingredients (name) VALUES ($1) ON CONFLICT DO NOTHING`,
        [ing]
      );
    }

    const allSteps = [
      "Beat Cream Cheese",
      "Add condensed Milk and blend",
      "Add Lemon Juice and blend",
      "Add the mix to the pie crust",
      "Spread the Cherry Jam",
      "Place in refrigerator for 3h",
      "Preheat the oven",
      "Mix the ingredients in a bowl",
      "Spread the mix on baking sheet",
      "Bake for 30'",
      "Cook Macaroni for 8'",
      "Melt butter in a saucepan",
      "Add flour, salt, pepper and mix",
      "Add Milk and mix",
      "Cook until mix is smooth",
      "Add cheddar cheese",
      "Add the macaroni",
      "Beat the eggs",
      "Add soya sauce, sugar and salt",
      "Add oil to a sauce pan",
      "Bring to medium heat",
      "Add some mix to the sauce pan",
      "Let is cook for 1'",
      "Remove pan from fire",
    ];
    for (let step of allSteps) {
      await client.query(
        `INSERT INTO steps (description) VALUES ($1) ON CONFLICT DO NOTHING`,
        [step]
      );
    }

    const recipes = [
      "No-Bake Cheesecake",
      "Roasted Brussels Sprouts",
      "Mac & Cheese",
      "Tamagoyaki Japanese Omelette",
    ];
    for (let rec of recipes) {
      await client.query(
        `INSERT INTO recipes (name) VALUES ($1) ON CONFLICT DO NOTHING`,
        [rec]
      );
    }

    const recipeCategories = {
      "No-Bake Cheesecake": ["Cake", "No-Bake", "Vegetarian"],
      "Roasted Brussels Sprouts": ["Vegan", "Gluten-Free"],
      "Mac & Cheese": ["Vegetarian"],
      "Tamagoyaki Japanese Omelette": ["Vegetarian", "Japanese"],
    };

    for (let [rec, cats] of Object.entries(recipeCategories)) {
      for (let cat of cats) {
        await client.query(
          `
          INSERT INTO recipe_category (recipe_id, category_id)
          SELECT r.recipe_id, c.category_id
          FROM recipes r, categories c
          WHERE r.name = $1 AND c.name = $2
          ON CONFLICT DO NOTHING
        `,
          [rec, cat]
        );
      }
    }

    const recipeIngredients = {
      "No-Bake Cheesecake": [
        "Condensed milk",
        "Cream Cheese",
        "Lemon Juice",
        "Pie Crust",
        "Cherry Jam",
      ],
      "Roasted Brussels Sprouts": [
        "Brussels Sprouts",
        "Lemon Juice",
        "Sesame seeds",
        "Pepper",
        "Salt",
        "Olive oil",
      ],
      "Mac & Cheese": [
        "Macaroni",
        "Butter",
        "Flour",
        "Salt",
        "Pepper",
        "Milk",
        "Shredded Cheddar cheese",
      ],
      "Tamagoyaki Japanese Omelette": [
        "Eggs",
        "Soy sauce",
        "Sugar",
        "Salt",
        "Olive oil",
      ],
    };

    for (let [rec, ings] of Object.entries(recipeIngredients)) {
      for (let ing of ings) {
        await client.query(
          `
          INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity)
          SELECT r.recipe_id, i.ingredient_id, 'to taste'
          FROM recipes r, ingredients i
          WHERE r.name = $1 AND i.name = $2
          ON CONFLICT DO NOTHING
        `,
          [rec, ing]
        );
      }
    }

    const recipeSteps = {
      "No-Bake Cheesecake": [
        "Beat Cream Cheese",
        "Add condensed Milk and blend",
        "Add Lemon Juice and blend",
        "Add the mix to the pie crust",
        "Spread the Cherry Jam",
        "Place in refrigerator for 3h",
      ],
      "Roasted Brussels Sprouts": [
        "Preheat the oven",
        "Mix the ingredients in a bowl",
        "Spread the mix on baking sheet",
        "Bake for 30'",
      ],
      "Mac & Cheese": [
        "Cook Macaroni for 8'",
        "Melt butter in a saucepan",
        "Add flour, salt, pepper and mix",
        "Add Milk and mix",
        "Cook until mix is smooth",
        "Add cheddar cheese",
        "Add the macaroni",
      ],
      "Tamagoyaki Japanese Omelette": [
        "Beat the eggs",
        "Add soya sauce, sugar and salt",
        "Add oil to a sauce pan",
        "Bring to medium heat",
        "Add some mix to the sauce pan",
        "Let is cook for 1'",
        "Remove pan from fire",
      ],
    };

    for (let [rec, steps] of Object.entries(recipeSteps)) {
      for (let i = 0; i < steps.length; i++) {
        await client.query(
          `
          INSERT INTO recipe_step (recipe_id, step_id, step_order)
          SELECT r.recipe_id, s.step_id, $1
          FROM recipes r, steps s
          WHERE r.name = $2 AND s.description = $3
          ON CONFLICT DO NOTHING
        `,
          [i + 1, rec, steps[i]]
        );
      }
    }

    console.log("Database setup complete!");
    await client.end();
  } catch (err) {
    console.error("Connection error:", err);
    await defaultClient.end();
  }
}

setupDatabase();
