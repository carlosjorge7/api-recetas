"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipes_controller_1 = require("../controllers/recipes.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.authenticate, recipes_controller_1.getRecipes);
router.get("/:id", auth_middleware_1.authenticate, recipes_controller_1.getRecipeById);
router.post("/", auth_middleware_1.authenticate, recipes_controller_1.createRecipe);
router.put("/:id", auth_middleware_1.authenticate, recipes_controller_1.updateRecipe);
router.delete("/:id", auth_middleware_1.authenticate, recipes_controller_1.deleteRecipe);
exports.default = router;
