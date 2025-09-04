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
 * components:
 *   schemas:
 *     RecipeIngredient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del ingrediente
 *         title:
 *           type: string
 *           description: Nombre del ingrediente
 *         quantity:
 *           type: string
 *           description: Cantidad del ingrediente
 *         unit:
 *           type: string
 *           description: Unidad de medida
 *       example:
 *         id: 1
 *         title: "Tomate"
 *         quantity: "2"
 *         unit: "unidades"
 *     Recipe:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la receta
 *         user_id:
 *           type: integer
 *           description: ID del usuario propietario
 *         title:
 *           type: string
 *           description: Título de la receta
 *         instructions:
 *           type: string
 *           description: Instrucciones de preparación
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipeIngredient'
 *           description: Lista de ingredientes
 *       example:
 *         id: 1
 *         user_id: 1
 *         title: "Ensalada de Tomate"
 *         instructions: "Cortar los tomates y servir"
 *         created_at: "2023-01-01T00:00:00.000Z"
 *         ingredients:
 *           - id: 1
 *             title: "Tomate"
 *             quantity: "2"
 *             unit: "unidades"
 *     CreateRecipeIngredient:
 *       type: object
 *       required:
 *         - ingredient_id
 *       properties:
 *         ingredient_id:
 *           type: integer
 *           description: ID del ingrediente existente (requerido)
 *         quantity:
 *           type: string
 *           description: Cantidad del ingrediente
 *         unit:
 *           type: string
 *           description: Unidad de medida
 *       example:
 *         ingredient_id: 1
 *         quantity: "2"
 *         unit: "unidades"
 *     CreateRecipeRequest:
 *       type: object
 *       required:
 *         - title
 *         - instructions
 *         - ingredients
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la receta
 *         instructions:
 *           type: string
 *           description: Instrucciones de preparación
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateRecipeIngredient'
 *           description: Lista de ingredientes
 *           minItems: 1
 *       example:
 *         title: "Ensalada de Tomate"
 *         instructions: "Cortar los tomates y servir"
 *         ingredients:
 *           - ingredient_id: 1
 *             quantity: "2"
 *             unit: "unidades"
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Obtener todas las recetas del usuario autenticado con sus ingredientes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de recetas con ingredientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", authenticate, getRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Obtener una receta por ID con sus ingredientes
 *     tags: [Recipes]
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
 *         description: Datos de la receta con ingredientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Receta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", authenticate, getRecipeById);

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Crear una nueva receta con ingredientes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipeRequest'
 *     responses:
 *       201:
 *         description: Receta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post("/", authenticate, createRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Editar una receta existente con sus ingredientes
 *     tags: [Recipes]
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
 *                 description: Título de la receta
 *               instructions:
 *                 type: string
 *                 description: Instrucciones de preparación
 *               ingredients:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CreateRecipeIngredient'
 *                 description: Lista de ingredientes
 *             example:
 *               title: "Ensalada de Tomate Actualizada"
 *               instructions: "Cortar los tomates, agregar sal y servir"
 *               ingredients:
 *                 - ingredient_id: 1
 *                   quantity: "3"
 *                   unit: "unidades"
 *                 - ingredient_id: 15
 *                   quantity: "1"
 *                   unit: "pizca"
 *     responses:
 *       200:
 *         description: Receta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Receta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", authenticate, updateRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Eliminar una receta existente
 *     tags: [Recipes]
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
 *         description: Receta eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Receta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", authenticate, deleteRecipe);

export default router;
