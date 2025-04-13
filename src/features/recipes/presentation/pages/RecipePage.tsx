 import React, { useState, useEffect } from "react";
import RecipeForm from "../componentes/RecipeForm";
import RecipeCard from "../componentes/RecipeCard";
import RecipeViewModel from "../viewmodels/RecipeViewModel";
import { Recipe } from "../../data/models/Recipe";

const RecipePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const [viewModel] = useState(() => new RecipeViewModel());

  useEffect(() => {
    viewModel.setCallbacks(
      (updatedRecipes) => setRecipes(updatedRecipes),
      (isLoading) => setLoading(isLoading),
      (errorMessage) => setError(errorMessage),
      () => {} 
    );
    
    viewModel.loadRecipes();
  }, [viewModel]);

  const handleFormSaved = () => {
    setShowForm(false);
  };

  const handleEditRecipe = (id: number, recipe: Recipe) => {
    viewModel.handleEditRecipe(id, recipe);
  };

  const handleDeleteRecipe = (id: number) => {
    viewModel.handleDeleteRecipe(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Recetas</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        {showForm ? (
          <div>
            <RecipeForm 
              viewModel={viewModel} 
              onSaved={handleFormSaved} 
            />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 w-full py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-md shadow-sm hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            Nueva Receta
          </button>
        )}
      </div>
      
      {loading && <div className="text-center py-4">Cargando...</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.recipe_id}
            recipe={recipe}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
          />
        ))}
      </div>
      
      {!loading && recipes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay recetas disponibles. ¡Crea una nueva!
        </div>
      )}
    </div>
  );
};

export default RecipePage;
