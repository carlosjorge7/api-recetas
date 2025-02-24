import { Request, Response } from "express";
import pool from "../model/db"; // Asegúrate de que el import sea correcto

interface AuthRequest extends Request {
  userId?: number;
}

/**
 * Obtener todas las recetas del usuario autenticado
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
      "SELECT * FROM recipes WHERE user_id = $1",
      [userId]
    );
    res.json(recipes.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las recetas" });
  }
};

/**
 * Obtener una receta específica del usuario autenticado
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
      "SELECT * FROM recipes WHERE id = $1 AND user_id = $2",
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
    res.status(500).json({ message: "Error al obtener la receta" });
  }
};

/**
 * Crear una nueva receta
 */
export const createRecipe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { title, ingredients, instructions } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const result = await pool.query(
      "INSERT INTO recipes (user_id, title, ingredients, instructions) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, ingredients, instructions]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la receta" });
  }
};

/**
 * Editar una receta existente
 */
export const updateRecipe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const recipeId = parseInt(req.params.id);
    const { title, ingredients, instructions } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const result = await pool.query(
      "UPDATE recipes SET title = $1, ingredients = $2, instructions = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [title, ingredients, instructions, recipeId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Receta no encontrada o no tienes permiso para editarla",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la receta" });
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
