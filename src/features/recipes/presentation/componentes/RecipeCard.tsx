import { useState, useEffect } from "react";
import { Recipe } from "../../data/models/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (id: number, recipe: Recipe) => void;
  onDelete: (id: number) => void;
}

const RecipeCard = ({ recipe, onEdit, onDelete }: RecipeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    console.log("RecipeCard recibió receta:", recipe);
    console.log("Recipe title:", recipe.title);
    console.log("Recipe ingredients:", recipe.ingredients);
    console.log("Recipe description:", recipe.description);
  }, [recipe]);

  useEffect(() => {
    if (recipe) {
      setEditTitle(recipe.title || "");
      setEditIngredients(recipe.ingredients || "");
      setEditDescription(recipe.description || "");
    }
  }, [recipe]);

  const handleCancelEdit = () => {
    setEditTitle(recipe.title || "");
    setEditIngredients(recipe.ingredients || "");
    setEditDescription(recipe.description || "");
    setIsEditing(false);
  };

  const handleSubmitEdit = () => {
    if (!editTitle.trim()) {
      alert("El título es obligatorio");
      return;
    }

    const updatedRecipe: Recipe = {
      ...recipe,
      title: editTitle,
      ingredients: editIngredients,
      description: editDescription,
    };

    onEdit(recipe.recipe_id, updatedRecipe);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {isEditing ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Editar Receta</h3>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            placeholder="Título"
          />
          <input
            type="text"
            value={editIngredients}
            onChange={(e) => setEditIngredients(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            placeholder="Ingredientes"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            placeholder="Descripción"
          ></textarea>
          <div className="flex space-x-2">
            <button
              onClick={handleSubmitEdit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-2">{String(recipe.title) || "Sin título"}</h3>
          <div className="mb-2">
            <span className="font-semibold">Ingredientes:</span> {String(recipe.ingredients) || "No especificados"}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Descripción:</span> {String(recipe.description) || "Sin descripción"}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(recipe.recipe_id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
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
