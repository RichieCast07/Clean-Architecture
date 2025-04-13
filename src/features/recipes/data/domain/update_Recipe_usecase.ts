import { Recipe } from "../models/Recipe";
import { RecipeRepository } from "../repository/RecipeRepository";

export class UpdateRecipeUseCase {
  async execute(id: number, recipe: Recipe): Promise<Recipe> {
    if (!id || id <= 0) {
      throw new Error("ID de receta inválido");
    }

    if (!recipe.title || recipe.title.trim() === '') {
      throw new Error("El título de la receta es obligatorio");
    }

    try {
      const existingRecipe = await RecipeRepository.getRecipeById(id);
      if (!existingRecipe) {
        throw new Error(`No existe una receta con ID ${id}`);
      }

      return await RecipeRepository.updateRecipe(id, recipe);
    } catch (error) {
      console.error(`Error en caso de uso updateRecipe(${id}):`, error);
      throw error;
    }
  }
}

export default UpdateRecipeUseCase;