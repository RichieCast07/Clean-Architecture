import React, { useState, useEffect } from "react";
import { RecipeViewModel } from "../viewmodels/RecipeViewModel";
import { Recipe } from "../../data/models/Recipe";

interface RecipeFormProps {
  recipeId?: number;  
  viewModel: RecipeViewModel;  
  onSaved: () => void;  
}

const RecipeForm = ({ recipeId, viewModel, onSaved }: RecipeFormProps) => {
  const [title, setTitle] = useState<string>("");  
  const [ingredients, setIngredients] = useState<string>("");  
  const [description, setDescription] = useState<string>("");  

  useEffect(() => {
    if (recipeId) {
      const recipes = viewModel.getLocalRecipes();
      const recipe = recipes.find(r => r.recipe_id === recipeId);
      
      if (recipe) {
        setTitle(recipe.title || "");
        setIngredients(recipe.ingredients || "");
        setDescription(recipe.description || "");
      } else {
        console.warn("Receta no encontrada en el estado local");
      }
    }
  }, [recipeId, viewModel]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newRecipe: Recipe = {
      recipe_id: recipeId ?? 0,
      title,
      ingredients,
      description,
    };

    try {
      if (recipeId) {
        await viewModel.handleEditRecipe(recipeId, newRecipe);
      } else {
        viewModel.setTitle(title);
        viewModel.setIngredients(ingredients);
        viewModel.setDescription(description);
        
        await viewModel.handleCreateRecipe();
      }
      onSaved(); 
    } catch (error) {
      console.error("Error al guardar la receta:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
          Ingredientes
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        {recipeId ? "Editar Receta" : "Crear Receta"}
      </button>
    </form>
  );
};

export default RecipeForm;
