import React, { useState } from "react";
import { Recipe } from "../../data/models/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (id: number, updatedRecipe: Recipe) => void; 
  onDelete: (id: number) => void; 
}

const RecipeCard = ({ recipe, onEdit, onDelete }: RecipeCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false); 
  const [newTitle, setNewTitle] = useState<string>(recipe.title);
  const [newIngredients, setNewIngredients] = useState<string>(recipe.ingredients);
  const [newDescription, setNewDescription] = useState<string>(recipe.description);

  const handleSave = () => {
    const updatedRecipe: Recipe = {
      ...recipe,
      title: newTitle,
      ingredients: newIngredients,
      description: newDescription,
    };
    onEdit(recipe.recipe_id, updatedRecipe);  
    setIsEditing(false); 
  };

  const handleCancel = () => {
    setNewTitle(recipe.title);
    setNewIngredients(recipe.ingredients);
    setNewDescription(recipe.description);
    setIsEditing(false);  
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={newIngredients}
            onChange={(e) => setNewIngredients(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          ></textarea>

          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold">{recipe.title}</h3>
          <p><strong>Ingredientes:</strong> {recipe.ingredients}</p>
          <p><strong>Descripción:</strong> {recipe.description}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setIsEditing(true)} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(recipe.recipe_id)} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
