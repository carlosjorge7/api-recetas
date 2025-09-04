import { Router } from "express";
import {
  getIngredients,
  getIngredientById,
  searchIngredients,
} from "../controllers/ingredients.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del ingrediente
 *         title:
 *           type: string
 *           description: Nombre del ingrediente
 *       example:
 *         id: 1
 *         title: "Tomate"
 *     CreateIngredientRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Nombre del ingrediente
 *       example:
 *         title: "Tomate"
 */

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     summary: Obtener todos los ingredientes
 *     tags: [Ingredients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ingredientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", authenticate, getIngredients);

/**
 * @swagger
 * /api/ingredients/search:
 *   get:
 *     summary: Buscar ingredientes por nombre
 *     tags: [Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Lista de ingredientes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 *       400:
 *         description: Parámetro de búsqueda requerido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/search", authenticate, searchIngredients);

/**
 * @swagger
 * /api/ingredients/{id}:
 *   get:
 *     summary: Obtener un ingrediente por ID
 *     tags: [Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ingrediente
 *     responses:
 *       200:
 *         description: Ingrediente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Ingrediente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", authenticate, getIngredientById);

export default router;
