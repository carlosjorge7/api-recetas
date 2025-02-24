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

router.get("/", authenticate, getRecipes);
router.get("/:id", authenticate, getRecipeById);
router.post("/", authenticate, createRecipe);
router.put("/:id", authenticate, updateRecipe);
router.delete("/:id", authenticate, deleteRecipe);

export default router;
