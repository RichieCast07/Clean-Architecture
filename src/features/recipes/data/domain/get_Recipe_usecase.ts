import { Recipe } from "../models/Recipe";
import { RecipeRepository } from "../repository/RecipeRepository";

export class GetRecipeUseCase {
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const response = await RecipeRepository.getAllRecipes();
      return response.recipes || [];
    } catch (error) {
      console.error("Error en caso de uso getAllRecipes:", error);
      throw error;
    }
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    if (!id || id <= 0) {
      throw new Error("ID de receta inválido");
    }

    try {
      const recipe = await RecipeRepository.getRecipeById(id);
      return recipe;
    } catch (error) {
      console.error(`Error en caso de uso getRecipeById(${id}):`, error);
      throw error;
    }
  }
}

export default GetRecipeUseCase;