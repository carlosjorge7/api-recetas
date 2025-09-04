-- Migración para agregar tabla de ingredientes y relación many-to-many con recetas
-- Ejecutar estos comandos en orden para migrar la base de datos existente

-- 1. Crear tabla de ingredientes
CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Crear tabla de relación muchos-a-muchos
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity VARCHAR(50),
    unit VARCHAR(20),
    UNIQUE(recipe_id, ingredient_id)
);

-- 3. Migrar datos existentes de la columna 'ingredients' (si existe)
-- NOTA: Si tu tabla recipes existente tiene una columna 'ingredients' tipo TEXT,
-- puedes migrar los datos manualmente creando ingredientes y relaciones
-- Este script asume que manejarás la migración de datos manualmente

-- 4. Opcional: Eliminar la columna 'ingredients' antigua después de migrar los datos
-- ALTER TABLE recipes DROP COLUMN IF EXISTS ingredients;

-- 5. Insertar ingredientes globales fijos (OBLIGATORIO)
INSERT INTO ingredients (title) VALUES 
    -- Vegetales y Verduras
    ('Tomate'),
    ('Cebolla'),
    ('Ajo'),
    ('Zanahoria'),
    ('Apio'),
    ('Pimiento rojo'),
    ('Pimiento verde'),
    ('Calabacín'),
    ('Berenjena'),
    ('Brócoli'),
    ('Coliflor'),
    ('Espinacas'),
    ('Lechuga'),
    ('Pepino'),
    ('Rábano'),
    ('Perejil'),
    ('Cilantro'),
    ('Albahaca'),
    ('Orégano'),
    ('Tomillo'),
    
    -- Proteínas
    ('Pechuga de pollo'),
    ('Muslo de pollo'),
    ('Carne de res'),
    ('Carne de cerdo'),
    ('Pescado blanco'),
    ('Salmón'),
    ('Atún'),
    ('Huevos'),
    ('Tofu'),
    ('Lentejas'),
    ('Garbanzos'),
    ('Frijoles negros'),
    ('Quinoa'),
    
    -- Lácteos
    ('Leche'),
    ('Queso'),
    ('Queso mozzarella'),
    ('Queso parmesano'),
    ('Queso cheddar'),
    ('Yogur'),
    ('Crema'),
    ('Mantequilla'),
    
    -- Granos y Cereales
    ('Arroz'),
    ('Pasta'),
    ('Pan'),
    ('Harina'),
    ('Avena'),
    ('Cebada'),
    
    -- Condimentos y Especias
    ('Sal'),
    ('Pimienta'),
    ('Aceite de oliva'),
    ('Aceite vegetal'),
    ('Vinagre'),
    ('Limón'),
    ('Lima'),
    ('Jengibre'),
    ('Comino'),
    ('Paprika'),
    ('Canela'),
    ('Azúcar'),
    ('Miel'),
    
    -- Frutos Secos y Semillas
    ('Almendras'),
    ('Nueces'),
    ('Pistachos'),
    ('Semillas de girasol'),
    ('Semillas de chía'),
    
    -- Frutas
    ('Manzana'),
    ('Plátano'),
    ('Naranja'),
    ('Fresa'),
    ('Uva'),
    ('Piña'),
    ('Mango'),
    ('Aguacate')
ON CONFLICT (title) DO NOTHING;

-- Verificar las tablas creadas
-- SELECT * FROM ingredients;
-- SELECT * FROM recipe_ingredients;
