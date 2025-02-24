"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.updateRecipe = exports.createRecipe = exports.getRecipeById = exports.getRecipes = void 0;
const db_1 = __importDefault(require("../model/db")); // Asegúrate de que el import sea correcto
/**
 * Obtener todas las recetas del usuario autenticado
 */
const getRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const recipes = yield db_1.default.query("SELECT * FROM recipes WHERE user_id = $1", [userId]);
        res.json(recipes.rows);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener las recetas" });
    }
});
exports.getRecipes = getRecipes;
/**
 * Obtener una receta específica del usuario autenticado
 */
const getRecipeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const recipeId = parseInt(req.params.id);
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const result = yield db_1.default.query("SELECT * FROM recipes WHERE id = $1 AND user_id = $2", [recipeId, userId]);
        if (result.rows.length === 0) {
            res.status(404).json({
                message: "Receta no encontrada o no tienes permiso para verla",
            });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener la receta" });
    }
});
exports.getRecipeById = getRecipeById;
/**
 * Crear una nueva receta
 */
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { title, ingredients, instructions } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const result = yield db_1.default.query("INSERT INTO recipes (user_id, title, ingredients, instructions) VALUES ($1, $2, $3, $4) RETURNING *", [userId, title, ingredients, instructions]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear la receta" });
    }
});
exports.createRecipe = createRecipe;
/**
 * Editar una receta existente
 */
const updateRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const recipeId = parseInt(req.params.id);
        const { title, ingredients, instructions } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const result = yield db_1.default.query("UPDATE recipes SET title = $1, ingredients = $2, instructions = $3 WHERE id = $4 AND user_id = $5 RETURNING *", [title, ingredients, instructions, recipeId, userId]);
        if (result.rows.length === 0) {
            res.status(404).json({
                message: "Receta no encontrada o no tienes permiso para editarla",
            });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar la receta" });
    }
});
exports.updateRecipe = updateRecipe;
/**
 * Eliminar una receta existente
 */
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const recipeId = parseInt(req.params.id);
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const result = yield db_1.default.query("DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *", [recipeId, userId]);
        if (result.rows.length === 0) {
            res.status(404).json({
                message: "Receta no encontrada o no tienes permiso para eliminarla",
            });
            return;
        }
        res.json({ message: "Receta eliminada correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar la receta" });
    }
});
exports.deleteRecipe = deleteRecipe;
