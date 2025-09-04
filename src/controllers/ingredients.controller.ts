import { Request, Response } from "express";
import pool from "../model/db";

/**
 * Obtener todos los ingredientes
 */
export const getIngredients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM ingredients ORDER BY title");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ingredientes:", error);
    res.status(500).json({ message: "Error al obtener los ingredientes" });
  }
};

/**
 * Obtener un ingrediente por ID
 */
export const getIngredientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ingredientId = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM ingredients WHERE id = $1", [
      ingredientId,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Ingrediente no encontrado" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener ingrediente:", error);
    res.status(500).json({ message: "Error al obtener el ingrediente" });
  }
};

/**
 * Buscar ingredientes por nombre
 */
export const searchIngredients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ message: "Parámetro de búsqueda requerido" });
      return;
    }

    const result = await pool.query(
      "SELECT * FROM ingredients WHERE LOWER(title) LIKE LOWER($1) ORDER BY title",
      [`%${q.trim()}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al buscar ingredientes:", error);
    res.status(500).json({ message: "Error al buscar ingredientes" });
  }
};
