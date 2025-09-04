-- ===============================================
-- MIGRACIÓN COMPLETA PARA API DE RECETAS
-- Ejecutar todo este script en Neon Database
-- ===============================================

-- 1. CREAR TABLA DE INGREDIENTES (si no existe)
CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL
);

-- 2. CREAR TABLA DE RELACIÓN MUCHOS-A-MUCHOS (si no existe)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity VARCHAR(50),
    unit VARCHAR(20),
    UNIQUE(recipe_id, ingredient_id)
);

-- 3. ELIMINAR LA COLUMNA 'ingredients' ANTIGUA DE LA TABLA RECIPES
ALTER TABLE recipes DROP COLUMN IF EXISTS ingredients;

-- 4. INSERTAR INGREDIENTES PREDEFINIDOS (LISTA COMPLETA)
INSERT INTO ingredients (title) VALUES 
    -- Vegetales y Verduras
    ('Tomate'),
    ('Cebolla'),
    ('Ajo'),
    ('Zanahoria'),
    ('Apio'),
    ('Pimiento rojo'),
    ('Pimiento verde'),
    ('Pimiento amarillo'),
    ('Calabacín'),
    ('Berenjena'),
    ('Brócoli'),
    ('Coliflor'),
    ('Espinacas'),
    ('Lechuga'),
    ('Rúcula'),
    ('Pepino'),
    ('Rábano'),
    ('Perejil'),
    ('Cilantro'),
    ('Albahaca'),
    ('Orégano'),
    ('Tomillo'),
    ('Romero'),
    ('Salvia'),
    ('Menta'),
    
    -- Proteínas Animales
    ('Pechuga de pollo'),
    ('Muslo de pollo'),
    ('Pollo entero'),
    ('Carne de res'),
    ('Carne molida'),
    ('Bistec'),
    ('Carne de cerdo'),
    ('Costillas de cerdo'),
    ('Jamón'),
    ('Tocino'),
    ('Chorizo'),
    ('Pescado blanco'),
    ('Salmón'),
    ('Atún'),
    ('Camarones'),
    ('Langostinos'),
    ('Mejillones'),
    ('Huevos'),
    
    -- Proteínas Vegetales
    ('Tofu'),
    ('Tempeh'),
    ('Lentejas'),
    ('Lentejas rojas'),
    ('Garbanzos'),
    ('Frijoles negros'),
    ('Frijoles rojos'),
    ('Frijoles blancos'),
    ('Quinoa'),
    ('Soja texturizada'),
    
    -- Lácteos
    ('Leche'),
    ('Leche de almendra'),
    ('Leche de coco'),
    ('Queso'),
    ('Queso mozzarella'),
    ('Queso parmesano'),
    ('Queso cheddar'),
    ('Queso feta'),
    ('Queso de cabra'),
    ('Yogur'),
    ('Yogur griego'),
    ('Crema'),
    ('Crema agria'),
    ('Mantequilla'),
    ('Queso crema'),
    
    -- Granos y Cereales
    ('Arroz'),
    ('Arroz integral'),
    ('Arroz basmati'),
    ('Pasta'),
    ('Pasta integral'),
    ('Fideos'),
    ('Pan'),
    ('Pan integral'),
    ('Harina'),
    ('Harina integral'),
    ('Avena'),
    ('Cebada'),
    ('Bulgur'),
    ('Cuscús'),
    
    -- Condimentos y Especias
    ('Sal'),
    ('Sal marina'),
    ('Pimienta'),
    ('Pimienta blanca'),
    ('Aceite de oliva'),
    ('Aceite de oliva extra virgen'),
    ('Aceite vegetal'),
    ('Aceite de coco'),
    ('Vinagre'),
    ('Vinagre balsámico'),
    ('Vinagre de manzana'),
    ('Limón'),
    ('Lima'),
    ('Jengibre'),
    ('Comino'),
    ('Paprika'),
    ('Pimentón dulce'),
    ('Canela'),
    ('Azúcar'),
    ('Azúcar morena'),
    ('Miel'),
    ('Jarabe de maple'),
    ('Salsa de soja'),
    ('Mostaza'),
    ('Mayonesa'),
    ('Ketchup'),
    ('Salsa picante'),
    ('Curry en polvo'),
    ('Cúrcuma'),
    ('Cardamomo'),
    ('Anís'),
    ('Laurel'),
    ('Clavo de olor'),
    
    -- Frutos Secos y Semillas
    ('Almendras'),
    ('Nueces'),
    ('Avellanas'),
    ('Pistachos'),
    ('Maní'),
    ('Semillas de girasol'),
    ('Semillas de chía'),
    ('Semillas de lino'),
    ('Semillas de sésamo'),
    ('Semillas de calabaza'),
    
    -- Frutas
    ('Manzana'),
    ('Pera'),
    ('Plátano'),
    ('Naranja'),
    ('Mandarina'),
    ('Limón'),
    ('Lima'),
    ('Fresa'),
    ('Arándanos'),
    ('Frambuesas'),
    ('Moras'),
    ('Uva'),
    ('Piña'),
    ('Mango'),
    ('Papaya'),
    ('Aguacate'),
    ('Coco'),
    ('Kiwi'),
    ('Melón'),
    ('Sandía'),
    ('Durazno'),
    ('Ciruela'),
    
    -- Otros Ingredientes
    ('Caldo de pollo'),
    ('Caldo de verduras'),
    ('Caldo de res'),
    ('Levadura'),
    ('Polvo de hornear'),
    ('Bicarbonato'),
    ('Gelatina'),
    ('Agar agar'),
    ('Fécula de maíz'),
    ('Tapioca'),
    ('Agua'),
    ('Hielo'),
    ('Vino blanco'),
    ('Vino tinto'),
    ('Cerveza'),
    ('Ron'),
    ('Brandy')
ON CONFLICT (title) DO NOTHING;

-- 5. VERIFICAR QUE TODO SE CREÓ CORRECTAMENTE
-- (Estos SELECT son para verificación, puedes comentarlos si quieres)

-- Ver estructura de la tabla recipes (sin columna ingredients)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'recipes' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Contar ingredientes insertados
SELECT COUNT(*) as total_ingredientes FROM ingredients;

-- Ver algunos ingredientes de ejemplo
SELECT id, title FROM ingredients ORDER BY title LIMIT 10;

-- Ver estructura de recipe_ingredients
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'recipe_ingredients' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===============================================
-- MIGRACIÓN COMPLETA
-- Tu API ahora está lista para funcionar con:
-- - Ingredientes fijos predefinidos (~150 ingredientes)
-- - Recetas con relación many-to-many a ingredientes
-- - Sin columna 'ingredients' en tabla recipes
-- ===============================================
