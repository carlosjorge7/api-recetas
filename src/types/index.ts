export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Ingredient {
  id: number;
  title: string;
}

export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  instructions: string;
  created_at: Date;
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
  ingredient_id: number;
  quantity?: string;
  unit?: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Array<{
    id: number;
    title: string;
    quantity?: string;
    unit?: string;
  }>;
}

export interface CreateRecipeRequest {
  title: string;
  instructions: string;
  ingredients: Array<{
    ingredient_id: number; // Solo permitir ingredientes existentes por ID
    quantity?: string;
    unit?: string;
  }>;
}

export interface UpdateRecipeRequest {
  title?: string;
  instructions?: string;
  ingredients?: Array<{
    ingredient_id: number; // Solo permitir ingredientes existentes por ID
    quantity?: string;
    unit?: string;
  }>;
}
