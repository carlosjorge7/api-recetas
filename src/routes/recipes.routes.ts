import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipes.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Obtener todas las recetas del usuario autenticado
 *     tags: [Recetas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de recetas
 *       401:
 *         description: No autorizado
 */
router.get("/", authenticate, getRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Obtener una receta por ID
 *     tags: [Recetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la receta
 *     responses:
 *       200:
 *         description: Datos de la receta
 *       404:
 *         description: Receta no encontrada
 */
router.get("/:id", authenticate, getRecipeById);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Crear una nueva receta
 *     tags: [Recetas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Receta creada
 *       400:
 *         description: Datos inválidos
 */
router.post("/", authenticate, createRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Editar una receta existente
 *     tags: [Recetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la receta a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Receta actualizada
 *       404:
 *         description: Receta no encontrada
 */
router.put("/:id", authenticate, updateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Eliminar una receta existente
 *     tags: [Recetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la receta a eliminar
 *     responses:
 *       200:
 *         description: Receta eliminada
 *       404:
 *         description: Receta no encontrada
 */
router.delete("/:id", authenticate, deleteRecipe);

export default router;
