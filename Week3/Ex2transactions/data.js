export const recipes = [
  {
    recipe_id: 1,
    recipe_name: "No-Bake Cheesecake",
  },
  {
    recipe_id: 2,
    recipe_name: "Roasted Brussels Sprouts",
  },
  {
    recipe_id: 3,
    recipe_name: "Mac & Cheese",
  },
  {
    recipe_id: 4,
    recipe_name: "Tamagoyaki Japanese Omelette",
  },
];

export const categories = [
  { category_id: 1, category_name: "Cake" },
  { category_id: 2, category_name: "No-Bake" },
  { category_id: 3, category_name: "Vegetarian" },
  { category_id: 4, category_name: "Vegan" },
  { category_id: 5, category_name: "Gluten-Free" },
  { category_id: 6, category_name: "Japanese" },
];

export const recipeCategories = [
  // No-Bake Cheesecake categories (recipe_id: 1)
  { recipe_id: 1, category_id: 1 }, // Cake
  { recipe_id: 1, category_id: 2 }, // No-Bake
  { recipe_id: 1, category_id: 3 }, // Vegetarian

  // Roasted Brussels Sprouts categories (recipe_id: 2)
  { recipe_id: 2, category_id: 4 }, // Vegan
  { recipe_id: 2, category_id: 5 }, // Gluten-Free

  // Mac & Cheese categories (recipe_id: 3)
  { recipe_id: 3, category_id: 3 }, // Vegetarian

  // Tamagoyaki Japanese Omelette categories (recipe_id: 4)
  { recipe_id: 4, category_id: 3 }, // Vegetarian
  { recipe_id: 4, category_id: 6 }, // Japanese
];

export const steps = [
  // No-Bake Cheesecake steps
  { step_id: 1, step_content: "Beat Cream Cheese" },
  { step_id: 2, step_content: "Add condensed Milk and blend" },
  { step_id: 3, step_content: "Add Lemon Juice and blend" },
  { step_id: 4, step_content: "Add the mix to the pie crust" },
  { step_id: 5, step_content: "Spread the Cherry Jam" },
  { step_id: 6, step_content: "Place in refrigerator for 3h" },

  // Roasted Brussels Sprouts steps
  { step_id: 7, step_content: "Preheat the oven" },
  { step_id: 8, step_content: "Mix the ingredients in a bowl" },
  { step_id: 9, step_content: "Spread the mix on baking sheet" },
  { step_id: 10, step_content: "Bake for 30'" },

  // Mac & Cheese steps
  { step_id: 11, step_content: "Cook Macaroni for 8'" },
  { step_id: 12, step_content: "Melt butter in a saucepan" },
  { step_id: 13, step_content: "Add flour, salt, pepper and mix" },
  { step_id: 14, step_content: "Add Milk and mix" },
  { step_id: 15, step_content: "Cook until mix is smooth" },
  { step_id: 16, step_content: "Add cheddar cheese" },
  { step_id: 17, step_content: "Add the macaroni" },

  // Tamagoyaki Japanese Omelette steps
  { step_id: 18, step_content: "Beat the eggs" },
  { step_id: 19, step_content: "Add soya sauce, sugar and salt" },
  { step_id: 20, step_content: "Add oil to a sauce pan" },
  { step_id: 21, step_content: "Bring to medium heat" },
  { step_id: 22, step_content: "Add some mix to the sauce pan" },
  { step_id: 23, step_content: "Let it cook for 1'" },
  { step_id: 24, step_content: "Add some mix to the sauce pan" },
  { step_id: 25, step_content: "Remove pan from fire" },
];

export const recipeSteps = [
  // No-Bake Cheesecake steps (recipe_id: 1)
  { step_number: 1, recipe_id: 1, step_id: 1 },
  { step_number: 2, recipe_id: 1, step_id: 2 },
  { step_number: 3, recipe_id: 1, step_id: 3 },
  { step_number: 4, recipe_id: 1, step_id: 4 },
  { step_number: 5, recipe_id: 1, step_id: 5 },
  { step_number: 6, recipe_id: 1, step_id: 6 },

  // Roasted Brussels Sprouts steps (recipe_id: 2)
  { step_number: 1, recipe_id: 2, step_id: 7 },
  { step_number: 2, recipe_id: 2, step_id: 8 },
  { step_number: 3, recipe_id: 2, step_id: 9 },
  { step_number: 4, recipe_id: 2, step_id: 10 },

  // Mac & Cheese steps (recipe_id: 3)
  { step_number: 1, recipe_id: 3, step_id: 11 },
  { step_number: 2, recipe_id: 3, step_id: 12 },
  { step_number: 3, recipe_id: 3, step_id: 13 },
  { step_number: 4, recipe_id: 3, step_id: 14 },
  { step_number: 5, recipe_id: 3, step_id: 15 },
  { step_number: 6, recipe_id: 3, step_id: 16 },
  { step_number: 7, recipe_id: 3, step_id: 17 },

  // Tamagoyaki Japanese Omelette steps (recipe_id: 4)
  { step_number: 1, recipe_id: 4, step_id: 18 },
  { step_number: 2, recipe_id: 4, step_id: 19 },
  { step_number: 3, recipe_id: 4, step_id: 20 },
  { step_number: 4, recipe_id: 4, step_id: 21 },
  { step_number: 5, recipe_id: 4, step_id: 22 },
  { step_number: 6, recipe_id: 4, step_id: 23 },
  { step_number: 7, recipe_id: 4, step_id: 20 },
  { step_number: 8, recipe_id: 4, step_id: 24 },
  { step_number: 9, recipe_id: 4, step_id: 23 },
  { step_number: 10, recipe_id: 4, step_id: 25 },
];

export const ingredients = [
  { ingredient_id: 1, ingredient_name: "Butter" },
  { ingredient_id: 2, ingredient_name: "Brussels Sprouts" },
  { ingredient_id: 3, ingredient_name: "Cherry Jam" },
  { ingredient_id: 4, ingredient_name: "Shredded Cheddar cheese" },
  { ingredient_id: 5, ingredient_name: "Condensed milk" },
  { ingredient_id: 6, ingredient_name: "Cream Cheese" },
  { ingredient_id: 7, ingredient_name: "Eggs" },
  { ingredient_id: 8, ingredient_name: "Flour" },
  { ingredient_id: 9, ingredient_name: "Lemon Juice" },
  { ingredient_id: 10, ingredient_name: "Macaroni" },
  { ingredient_id: 11, ingredient_name: "Milk" },
  { ingredient_id: 12, ingredient_name: "Olive oil" },
  { ingredient_id: 13, ingredient_name: "Pepper" },
  { ingredient_id: 14, ingredient_name: "Pie Crust" },
  { ingredient_id: 15, ingredient_name: "Salt" },
  { ingredient_id: 16, ingredient_name: "Sesame seeds" },
  { ingredient_id: 17, ingredient_name: "Soy sauce" },
  { ingredient_id: 18, ingredient_name: "Sugar" },
];

export const recipeStepIngredients = [
  // No-Bake Cheesecake steps (recipe_id: 1)
  { step_id: 1, ingredient_id: 6 }, // Cream Cheese
  { step_id: 2, ingredient_id: 5 }, // Condensed milk
  { step_id: 3, ingredient_id: 9 }, // Lemon Juice
  { step_id: 4, ingredient_id: 14 }, // Pie Crust
  { step_id: 5, ingredient_id: 3 }, // Cherry Jam

  // Mac & Cheese steps (recipe_id: 3)
  { step_id: 11, ingredient_id: 10 }, // Macaroni
  { step_id: 12, ingredient_id: 1 }, // Butter
  { step_id: 13, ingredient_id: 8 }, // Flour
  { step_id: 13, ingredient_id: 15 }, // Salt
  { step_id: 13, ingredient_id: 13 }, // Pepper
  { step_id: 14, ingredient_id: 11 }, // Milk
  { step_id: 16, ingredient_id: 4 }, // Shredded Cheddar cheese
  { step_id: 17, ingredient_id: 10 }, // Macaroni

  // Tamagoyaki Japanese Omelette steps (recipe_id: 4)
  { step_id: 18, ingredient_id: 7 }, // Eggs
  { step_id: 19, ingredient_id: 17 }, // Soy sauce
  { step_id: 19, ingredient_id: 18 }, // Sugar
  { step_id: 19, ingredient_id: 15 }, // Salt
  { step_id: 20, ingredient_id: 12 }, // Olive oil
];
