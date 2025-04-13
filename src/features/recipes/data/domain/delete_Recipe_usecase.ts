import { RecipeRepository } from "../repository/RecipeRepository";

export class DeleteRecipeUseCase {
  async execute(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error("ID de receta inválido");
    }

    try {
      const existingRecipe = await RecipeRepository.getRecipeById(id);
      if (!existingRecipe) {
        throw new Error(`No existe una receta con ID ${id}`);
      }

      await RecipeRepository.deleteRecipe(id);
      return true;
    } catch (error) {
      console.error(`Error en caso de uso deleteRecipe(${id}):`, error);
      throw error;
    }
  }
}

export default DeleteRecipeUseCase;