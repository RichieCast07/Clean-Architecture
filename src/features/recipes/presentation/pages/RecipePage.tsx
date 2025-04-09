import { useEffect, useState } from "react";
import { Recipe } from "../../data/models/Recipe";
import RecipeViewModel from "../viewmodels/RecipeViewModel";
import RecipeCard from "./RecipeCard";  

const viewModel = new RecipeViewModel();

export function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]); 
  const [title, setTitle] = useState<string>("");  
  const [ingredients, setIngredients] = useState<string>("");  
  const [description, setDescription] = useState<string>("");  

  const loadRecipes = async () => {
    const data = await viewModel.getAllRecipes();
    setRecipes(data); 
  };

  const handleCreateRecipe = async () => {
    const newRecipe: Recipe = {
      recipe_id: 0, 
      title,
      ingredients,
      description,
    };

    const createdRecipe = await viewModel.createRecipe(newRecipe);
    if (createdRecipe) {
      setTitle("");
      setIngredients("");
      setDescription("");
      setRecipes((prevRecipes) => [createdRecipe, ...prevRecipes]); 
    }
  };

  const handleEditRecipe = (id: number, updatedRecipe: Recipe) => {
    viewModel.updateRecipe(id, updatedRecipe);  
    setRecipes((prevRecipes) => 
      prevRecipes.map((recipe) => 
        recipe.recipe_id === id ? updatedRecipe : recipe
      )
    ); 
  };

  const handleDeleteRecipe = async (id: number) => {
    const success = await viewModel.deleteRecipe(id);
    if (success) {
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.recipe_id !== id));
    }
  };

  useEffect(() => {
    loadRecipes();  
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Recetas</h1>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear nueva receta</h2>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Ingredientes"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        ></textarea>
        <button
          onClick={handleCreateRecipe}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Crear receta
        </button>
      </div>

      <div className="space-y-4">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No hay recetas disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default RecipePage;
