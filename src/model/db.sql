CREATE DATABASE recetas_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    instructions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity VARCHAR(50),
    unit VARCHAR(20),
    UNIQUE(recipe_id, ingredient_id)
);
