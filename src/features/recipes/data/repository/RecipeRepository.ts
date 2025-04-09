import { Recipe } from "../models/Recipe";

const apiUrl = "http://localhost:8080/recipes";

export const RecipeRepository = {
  getAllRecipes: async (): Promise<{ recipes: Recipe[] }> => {
    const response = await fetch(`${apiUrl}/`);
    if (!response.ok) {
      throw new Error("Error al obtener las recetas");
    }
    return await response.json();
  },

  getRecipeById: async (id: number): Promise<Recipe> => {
    const response = await fetch(`${apiUrl}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener la receta");
    }
    return await response.json();
  },

  createRecipe: async (recipe: Recipe): Promise<Recipe> => {
    const response = await fetch(`${apiUrl}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      throw new Error("Error al crear la receta");
    }
    return await response.json();
  },

  updateRecipe: async (id: number, recipe: Recipe): Promise<Recipe> => {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar la receta");
    }
    return await response.json();
  },

  deleteRecipe: async (id: number): Promise<void> => {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar la receta");
    }
  },
};
