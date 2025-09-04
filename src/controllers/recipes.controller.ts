import { Request, Response } from "express";
import pool from "../model/db";
import {
  RecipeWithIngredients,
  CreateRecipeRequest,
  UpdateRecipeRequest,
} from "../types";

interface AuthRequest extends Request {
  userId?: number;
}

/**
 * Obtener todas las recetas del usuario autenticado con sus ingredientes
 */
export const getRecipes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const recipes = await pool.query(
      `
      SELECT 
        r.id,
        r.user_id,
        r.title,
        r.instructions,
        r.created_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', i.id,
              'title', i.title,
              'quantity', ri.quantity,
              'unit', ri.unit
            ) ORDER BY i.title
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'::json
        ) as ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE r.user_id = $1
      GROUP BY r.id, r.user_id, r.title, r.instructions, r.created_at
      ORDER BY r.created_at DESC
    `,
      [userId]
    );

    res.json(recipes.rows);
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    res.status(500).json({ message: "Error al obtener las recetas" });
  }
};

/**
 * Obtener una receta específica del usuario autenticado con sus ingredientes
 */
export const getRecipeById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const recipeId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const result = await pool.query(
      `
      SELECT 
        r.id,
        r.user_id,
        r.title,
        r.instructions,
        r.created_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', i.id,
              'title', i.title,
              'quantity', ri.quantity,
              'unit', ri.unit
            ) ORDER BY i.title
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'::json
        ) as ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE r.id = $1 AND r.user_id = $2
      GROUP BY r.id, r.user_id, r.title, r.instructions, r.created_at
    `,
      [recipeId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Receta no encontrada o no tienes permiso para verla",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener receta:", error);
    res.status(500).json({ message: "Error al obtener la receta" });
  }
};

/**
 * Crear una nueva receta con ingredientes
 */
export const createRecipe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect();

  try {
    const userId = req.userId;
    const { title, instructions, ingredients }: CreateRecipeRequest = req.body;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    if (!title || !instructions || !ingredients || ingredients.length === 0) {
      res.status(400).json({
        message: "Título, instrucciones e ingredientes son requeridos",
      });
      return;
    }

    await client.query("BEGIN");

    // Crear la receta
    const recipeResult = await client.query(
      "INSERT INTO recipes (user_id, title, instructions) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, instructions]
    );

    const recipeId = recipeResult.rows[0].id;

    // Procesar ingredientes - solo permitir ingredientes existentes por ID
    for (const ingredient of ingredients) {
      const ingredientId = ingredient.ingredient_id;

      if (!ingredientId) {
        await client.query("ROLLBACK");
        res.status(400).json({
          message:
            "Cada ingrediente debe tener un ID válido de la lista predefinida",
        });
        return;
      }

      // Verificar que el ingrediente existe
      const ingredientExists = await client.query(
        "SELECT id FROM ingredients WHERE id = $1",
        [ingredientId]
      );

      if (ingredientExists.rows.length === 0) {
        await client.query("ROLLBACK");
        res.status(400).json({
          message: `El ingrediente con ID ${ingredientId} no existe`,
        });
        return;
      }

      // Agregar la relación receta-ingrediente
      await client.query(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)",
        [recipeId, ingredientId, ingredient.quantity, ingredient.unit]
      );
    }

    await client.query("COMMIT");

    // Obtener la receta completa con ingredientes
    const completeRecipe = await pool.query(
      `
      SELECT 
        r.id,
        r.user_id,
        r.title,
        r.instructions,
        r.created_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', i.id,
            'title', i.title,
            'quantity', ri.quantity,
            'unit', ri.unit
          ) ORDER BY i.title
        ) as ingredients
      FROM recipes r
      JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE r.id = $1
      GROUP BY r.id, r.user_id, r.title, r.instructions, r.created_at
    `,
      [recipeId]
    );

    res.status(201).json(completeRecipe.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear receta:", error);
    res.status(500).json({ message: "Error al crear la receta" });
  } finally {
    client.release();
  }
};

/**
 * Editar una receta existente con sus ingredientes
 */
export const updateRecipe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect();

  try {
    const userId = req.userId;
    const recipeId = parseInt(req.params.id);
    const { title, instructions, ingredients }: UpdateRecipeRequest = req.body;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    await client.query("BEGIN");

    // Verificar que la receta existe y pertenece al usuario
    const recipeCheck = await client.query(
      "SELECT id FROM recipes WHERE id = $1 AND user_id = $2",
      [recipeId, userId]
    );

    if (recipeCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({
        message: "Receta no encontrada o no tienes permiso para editarla",
      });
      return;
    }

    // Actualizar la receta si se proporcionan title o instructions
    if (title !== undefined || instructions !== undefined) {
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      if (title !== undefined) {
        updateFields.push(`title = $${paramCount}`);
        updateValues.push(title);
        paramCount++;
      }

      if (instructions !== undefined) {
        updateFields.push(`instructions = $${paramCount}`);
        updateValues.push(instructions);
        paramCount++;
      }

      updateValues.push(recipeId);
      updateValues.push(userId);

      await client.query(
        `UPDATE recipes SET ${updateFields.join(
          ", "
        )} WHERE id = $${paramCount} AND user_id = $${paramCount + 1}`,
        updateValues
      );
    }

    // Actualizar ingredientes si se proporcionan
    if (ingredients !== undefined) {
      // Eliminar ingredientes existentes
      await client.query(
        "DELETE FROM recipe_ingredients WHERE recipe_id = $1",
        [recipeId]
      );

      // Agregar nuevos ingredientes - solo permitir ingredientes existentes por ID
      for (const ingredient of ingredients) {
        const ingredientId = ingredient.ingredient_id;

        if (!ingredientId) {
          await client.query("ROLLBACK");
          res.status(400).json({
            message:
              "Cada ingrediente debe tener un ID válido de la lista predefinida",
          });
          return;
        }

        // Verificar que el ingrediente existe
        const ingredientExists = await client.query(
          "SELECT id FROM ingredients WHERE id = $1",
          [ingredientId]
        );

        if (ingredientExists.rows.length === 0) {
          await client.query("ROLLBACK");
          res.status(400).json({
            message: `El ingrediente con ID ${ingredientId} no existe`,
          });
          return;
        }

        // Agregar la relación receta-ingrediente
        await client.query(
          "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)",
          [recipeId, ingredientId, ingredient.quantity, ingredient.unit]
        );
      }
    }

    await client.query("COMMIT");

    // Obtener la receta actualizada con ingredientes
    const updatedRecipe = await pool.query(
      `
      SELECT 
        r.id,
        r.user_id,
        r.title,
        r.instructions,
        r.created_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', i.id,
              'title', i.title,
              'quantity', ri.quantity,
              'unit', ri.unit
            ) ORDER BY i.title
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'::json
        ) as ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE r.id = $1
      GROUP BY r.id, r.user_id, r.title, r.instructions, r.created_at
    `,
      [recipeId]
    );

    res.json(updatedRecipe.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar receta:", error);
    res.status(500).json({ message: "Error al actualizar la receta" });
  } finally {
    client.release();
  }
};

/**
 * Eliminar una receta existente
 */
export const deleteRecipe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const recipeId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const result = await pool.query(
      "DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *",
      [recipeId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Receta no encontrada o no tienes permiso para eliminarla",
      });
      return;
    }

    res.json({ message: "Receta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la receta" });
  }
};
