import { Recipe } from "../models/Recipe";
import { RecipeRepository } from "../repository/RecipeRepository";

export class CreateRecipeUseCase {
  async execute(recipe: Recipe): Promise<Recipe> {
    if (!recipe.title || recipe.title.trim() === '') {
      throw new Error("El título de la receta es obligatorio");
    }

    try {
      console.log("CreateRecipeUseCase - Enviando receta al repositorio:", recipe);
      const createdRecipe = await RecipeRepository.createRecipe(recipe);
      console.log("CreateRecipeUseCase - Receta creada recibida del repositorio:", createdRecipe);
      return createdRecipe;
    } catch (error) {
      console.error("Error en CreateRecipeUseCase:", error);
      throw error;
    }
  }
}

export default CreateRecipeUseCase;