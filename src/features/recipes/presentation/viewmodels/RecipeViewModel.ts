import { Recipe } from "../../data/models/Recipe";
import { RecipeRepository } from "../../data/repository/RecipeRepository";

export class RecipeViewModel {
  private recipes: Recipe[] = [];

  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const response = await RecipeRepository.getAllRecipes();
      this.recipes = response.recipes || [];  
      return this.recipes;
    } catch (error) {
      console.error("Error al obtener recetas:", error);
      return [];  
    }
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    try {
      return await RecipeRepository.getRecipeById(id);
    } catch (error) {
      console.error(`Error al obtener la receta con ID ${id}:`, error);
      return null;
    }
  }

  async createRecipe(recipe: Recipe): Promise<Recipe | null> {
    try {
      const createdRecipe = await RecipeRepository.createRecipe(recipe);
      this.recipes.unshift(createdRecipe);  
      return createdRecipe;
    } catch (error) {
      console.error("Error al crear la receta:", error);
      return null;
    }
  }

  async updateRecipe(id: number, updatedRecipe: Recipe): Promise<Recipe | null> {
    try {
      const recipeIndex = this.recipes.findIndex((recipe) => recipe.recipe_id === id);
      if (recipeIndex === -1) {
        return null;  
      }
      
      const updated = await RecipeRepository.updateRecipe(id, updatedRecipe);
      this.recipes[recipeIndex] = updated;
      return updated;
    } catch (error) {
      console.error("Error al actualizar la receta:", error);
      return null;
    }
  }

  async deleteRecipe(id: number): Promise<boolean> {
    try {
      await RecipeRepository.deleteRecipe(id);
      this.recipes = this.recipes.filter((recipe) => recipe.recipe_id !== id); 
      return true;
    } catch (error) {
      console.error("Error al eliminar la receta:", error);
      return false;
    }
  }

  getLocalRecipes(): Recipe[] {
    return this.recipes;
  }
}

export default RecipeViewModel;
