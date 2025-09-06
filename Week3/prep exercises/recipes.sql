-- ==========================================
-- Database: Recipe Management
-- Normalization: 3NF (all tables analyzed)
-- ==========================================

-- Table to store recipes
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,            -- 1NF: atomic values, unique identifier
  name VARCHAR(200) NOT NULL        -- 2NF: depends fully on PK, 3NF: no transitive dependency
);

-- Table to store categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,            -- 1NF: atomic
  name VARCHAR(100) NOT NULL UNIQUE -- 2NF: depends fully on PK, 3NF: no transitive dependency
);

-- Junction table for many-to-many relationship between recipes and categories
CREATE TABLE recipe_categories (
  recipe_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (recipe_id, category_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  -- 1NF: no repeating groups
  -- 2NF: attributes depend on full PK
  -- 3NF: no transitive dependencies
);

-- Table to store ingredients
CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,            -- atomic
  name VARCHAR(150) NOT NULL UNIQUE -- normalized
);

-- Junction table for many-to-many relationship between recipes and ingredients
CREATE TABLE recipe_ingredients (
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  amount NUMERIC,                   -- optional: structured amount
  unit VARCHAR(20),                 -- optional: measurement unit
  PRIMARY KEY (recipe_id, ingredient_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Table to store steps (instructions)
CREATE TABLE steps (
  id SERIAL PRIMARY KEY,
  recipe_id INT NOT NULL,          -- FK to recipes
  step_number INT NOT NULL,        -- order of the step
  instruction TEXT NOT NULL,       -- atomic text
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- ==========================================
-- Insert sample data
-- ==========================================

-- Recipes
INSERT INTO recipes (name) VALUES
('No-Bake Cheesecake'),
('Roasted Brussels Sprouts'),
('Mac & Cheese'),
('Tamagoyaki Japanese Omelette');

-- Categories
INSERT INTO categories (name) VALUES
('Cake'),
('No-Bake'),
('Vegetarian'),
('Vegan'),
('Gluten-Free'),
('Japanese');

-- Link recipes to categories
INSERT INTO recipe_categories (recipe_id, category_id) VALUES
(1, 1), (1, 2), (1, 3),     -- Cheesecake: Cake, No-Bake, Vegetarian
(2, 4), (2, 5),             -- Brussels Sprouts: Vegan, Gluten-Free
(3, 3),                     -- Mac & Cheese: Vegetarian
(4, 3), (4, 6);             -- Tamagoyaki: Vegetarian, Japanese

-- Ingredients
INSERT INTO ingredients (name) VALUES
('Condensed milk'),
('Cream Cheese'),
('Lemon Juice'),
('Pie Crust'),
('Cherry Jam'),
('Brussels Sprouts'),
('Sesame seeds'),
('Pepper'),
('Salt'),
('Olive oil'),
('Macaroni'),
('Butter'),
('Flour'),
('Milk'),
('Shredded Cheddar cheese'),
('Eggs'),
('Soy sauce'),
('Sugar');

-- Link recipes to ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),     -- Cheesecake
(2, 6), (2, 3), (2, 7), (2, 8), (2, 9), (2, 10), -- Brussels Sprouts
(3, 11), (3, 12), (3, 13), (3, 9), (3, 8), (3, 14), (3, 15), -- Mac & Cheese
(4, 16), (4, 17), (4, 18), (4, 9), (4, 10);  -- Tamagoyaki

-- Steps
INSERT INTO steps (recipe_id, step_number, instruction) VALUES
-- Cheesecake
(1, 1, 'Beat Cream Cheese'),
(1, 2, 'Add condensed milk and blend'),
(1, 3, 'Add lemon juice and blend'),
(1, 4, 'Add the mix to the pie crust'),
(1, 5, 'Spread the cherry jam'),
(1, 6, 'Place in refrigerator for 3h'),
-- Brussels Sprouts
(2, 1, 'Preheat the oven'),
(2, 2, 'Mix the ingredients in a bowl'),
(2, 3, 'Spread the mix on baking sheet'),
(2, 4, 'Bake for 30 minutes'),
-- Mac & Cheese
(3, 1, 'Cook macaroni for 8 minutes'),
(3, 2, 'Melt butter in a saucepan'),
(3, 3, 'Add flour, salt, pepper and mix'),
(3, 4, 'Add milk and mix'),
(3, 5, 'Cook until smooth'),
(3, 6, 'Add cheddar cheese'),
(3, 7, 'Add the macaroni'),
-- Tamagoyaki
(4, 1, 'Beat the eggs'),
(4, 2, 'Add soy sauce, sugar and salt'),
(4, 3, 'Add oil to a sauce pan'),
(4, 4, 'Bring to medium heat'),
(4, 5, 'Add some egg mix to the pan'),
(4, 6, 'Let it cook for 1 minute'),
(4, 7, 'Add oil again'),
(4, 8, 'Add some more egg mix'),
(4, 9, 'Let it cook for 1 minute'),
(4, 10, 'Remove pan from heat');

-- ==========================================
-- Example queries
-- ==========================================

-- 1. All vegetarian recipes
SELECT r.name
FROM recipes r
JOIN recipe_categories rc ON r.id = rc.recipe_id
JOIN categories c ON rc.category_id = c.id
WHERE c.name = 'Vegetarian';

-- 2. All cakes that do not need baking
SELECT r.name
FROM recipes r
JOIN recipe_categories rc ON r.id = rc.recipe_id
JOIN categories c ON rc.category_id = c.id
WHERE c.name IN ('Cake', 'No-Bake')
GROUP BY r.name
HAVING COUNT(DISTINCT c.name) = 2;

-- 3. All vegan and Japanese recipes
SELECT r.name
FROM recipes r
JOIN recipe_categories rc ON r.id = rc.recipe_id
JOIN categories c ON rc.category_id = c.id
WHERE c.name IN ('Vegan', 'Japanese')
GROUP BY r.name
HAVING COUNT(DISTINCT c.name) = 2;

-- ==========================================
-- Normalization Reflection
-- ==========================================
-- Was your database already in 2NF / 3NF?
-- -> Yes, the design was already in 3NF.
--
-- What changes did you have to do to normalize?
-- -> Simplified steps (direct link to recipe_id), 
--    added structured quantity fields (amount, unit) for recipe_ingredients,
--    enforced FK constraints explicitly.
