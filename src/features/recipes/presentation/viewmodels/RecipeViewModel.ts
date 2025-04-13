import { Recipe } from "../../data/models/Recipe";
import GetRecipeUseCase from "../../data/domain/get_Recipe_usecase";
import CreateRecipeUseCase from "../../data/domain/create_Recipe_usecase";
import UpdateRecipeUseCase from "../../data/domain/update_Recipe_usecase";
import DeleteRecipeUseCase from "../../data/domain/delete_Recipe_usecase";

export class RecipeViewModel {
  private recipes: Recipe[] = [];
  private getRecipeUseCase: GetRecipeUseCase;
  private createRecipeUseCase: CreateRecipeUseCase;
  private updateRecipeUseCase: UpdateRecipeUseCase;
  private deleteRecipeUseCase: DeleteRecipeUseCase;

  public title: string = "";
  public ingredients: string = "";
  public description: string = "";
  public loading: boolean = false;
  public error: string | null = null;

  private onRecipesChanged: (recipes: Recipe[]) => void = () => {};
  private onLoadingChanged: (loading: boolean) => void = () => {};
  private onErrorChanged: (error: string | null) => void = () => {};
  private onFormReset: () => void = () => {};

  constructor() {
    this.getRecipeUseCase = new GetRecipeUseCase();
    this.createRecipeUseCase = new CreateRecipeUseCase();
    this.updateRecipeUseCase = new UpdateRecipeUseCase();
    this.deleteRecipeUseCase = new DeleteRecipeUseCase();
  }

  public setCallbacks(
    onRecipesChanged: (recipes: Recipe[]) => void,
    onLoadingChanged: (loading: boolean) => void,
    onErrorChanged: (error: string | null) => void,
    onFormReset: () => void
  ) {
    this.onRecipesChanged = onRecipesChanged;
    this.onLoadingChanged = onLoadingChanged;
    this.onErrorChanged = onErrorChanged;
    this.onFormReset = onFormReset;
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public setIngredients(ingredients: string) {
    this.ingredients = ingredients;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public resetForm() {
    this.title = "";
    this.ingredients = "";
    this.description = "";
    this.onFormReset();
  }

  private normalizeRecipe(recipe: Recipe): Recipe {
    return {
      ...recipe,
      recipe_id: recipe.recipe_id || 0,
      title: recipe.title || "",
      ingredients: recipe.ingredients || "",
      description: recipe.description || ""
    };
  }

  async loadRecipes() {
    this.loading = true;
    this.onLoadingChanged(true);
    
    try {
      const fetchedRecipes = await this.getRecipeUseCase.getAllRecipes();
      console.log("Recetas obtenidas del servidor:", fetchedRecipes);
      
      // Normalizar todas las recetas
      this.recipes = fetchedRecipes.map(recipe => this.normalizeRecipe(recipe));
      console.log("Recetas normalizadas:", this.recipes);
      
      this.onRecipesChanged([...this.recipes]);
      this.error = null;
      this.onErrorChanged(null);
    } catch (error) {
      console.error("Error completo al cargar recetas:", error);
      this.error = "Error al cargar las recetas";
      this.onErrorChanged(this.error);
    } finally {
      this.loading = false;
      this.onLoadingChanged(false);
    }
  }

  async handleCreateRecipe() {
    if (!this.title.trim()) {
      this.error = "El título es obligatorio";
      this.onErrorChanged(this.error);
      return;
    }
    
    this.loading = true;
    this.onLoadingChanged(true);
    
    try {
      const newRecipe: Recipe = {
        recipe_id: 0,
        title: this.title,
        ingredients: this.ingredients || "",
        description: this.description || "",
      };
      
      const response = await this.createRecipeUseCase.execute(newRecipe);
      
      if (response && 'message' in response) {
        const tempId = response.recipe_id || Date.now();
        const createdRecipe: Recipe = {
          recipe_id: tempId,
          title: this.title,
          ingredients: this.ingredients || "",
          description: this.description || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const updatedRecipes = [createdRecipe, ...this.recipes];
        this.recipes = updatedRecipes;
        this.onRecipesChanged(updatedRecipes);
        this.resetForm();
        this.error = null;
        this.onErrorChanged(null);
      } else {
        const updatedRecipes = [response, ...this.recipes];
        this.recipes = updatedRecipes;
        this.onRecipesChanged(updatedRecipes);
        this.resetForm();
        this.error = null;
        this.onErrorChanged(null);
      }
    } catch (error) {
      this.error = "Error al crear la receta";
      this.onErrorChanged(this.error);
      console.error(error);
    } finally {
      this.loading = false;
      this.onLoadingChanged(false);
    }
  }

  async handleEditRecipe(id: number, updatedRecipe: Recipe) {
    this.loading = true;
    this.onLoadingChanged(true);
    
    try {
      if (id >= 1000) { 
        console.log("Actualizando receta temporal del cliente:", id);
        const updatedRecipes = this.recipes.map(recipe => 
          recipe.recipe_id === id ? {
            ...updatedRecipe,
            updated_at: new Date().toISOString()
          } : recipe
        );
        this.recipes = updatedRecipes;
        this.onRecipesChanged(updatedRecipes);
        this.error = null;
        this.onErrorChanged(null);
        return;
      }
      
      const normalizedRecipe = {
        ...updatedRecipe,
        title: updatedRecipe.title || "",
        ingredients: updatedRecipe.ingredients || "",
        description: updatedRecipe.description || ""
      };
      
      const immediateUpdateRecipes = this.recipes.map(recipe => 
        recipe.recipe_id === id ? normalizedRecipe : recipe
      );
      this.recipes = immediateUpdateRecipes;
      this.onRecipesChanged(immediateUpdateRecipes);
      
      const response = await this.updateRecipeUseCase.execute(id, normalizedRecipe);
      
      if (response && 'message' in response) {
        console.log("Respuesta del servidor con mensaje:", response);
        
        const updatedRecipeWithData = {
          ...normalizedRecipe,
          recipe_id: id,
          updated_at: new Date().toISOString()
        };
        
        const updatedRecipes = this.recipes.map(recipe => 
          recipe.recipe_id === id ? updatedRecipeWithData : recipe
        );
        
        this.recipes = updatedRecipes;
        this.onRecipesChanged(updatedRecipes);
        this.error = null;
        this.onErrorChanged(null);
      } else if (response) {

        const normalizedResponse = {
          ...response,
          title: response.title || "",
          ingredients: response.ingredients || "",
          description: response.description || ""
        };
        
        const updatedRecipes = this.recipes.map(recipe => 
          recipe.recipe_id === id ? normalizedResponse : recipe
        );
        
        this.recipes = updatedRecipes;
        this.onRecipesChanged(updatedRecipes);
        this.error = null;
        this.onErrorChanged(null);
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
    } catch (error) {
      console.error("Error completo al actualizar receta:", error);
      
      const updatedRecipes = this.recipes.map(recipe => 
        recipe.recipe_id === id ? {
          ...updatedRecipe,
          title: updatedRecipe.title || "",
          ingredients: updatedRecipe.ingredients || "",
          description: updatedRecipe.description || ""
        } : recipe
      );
      
      this.recipes = updatedRecipes;
      this.onRecipesChanged(updatedRecipes);
      this.error = null;
      this.onErrorChanged(null);
    } finally {
      this.loading = false;
      this.onLoadingChanged(false);
    }
  }

  async handleDeleteRecipe(id: number) {
    this.loading = true;
    this.onLoadingChanged(true);
    
    try {
      console.log("Eliminando receta con ID:", id);
      
      if (id >= 1000) { 
        console.log("Eliminando receta temporal del cliente");
        const updatedRecipes = this.recipes.filter(recipe => recipe.recipe_id !== id);
        this.recipes = updatedRecipes;
        this.onRecipesChanged(updatedRecipes);
        this.error = null;
        this.onErrorChanged(null);
        return;
      }
      
      const success = await this.deleteRecipeUseCase.execute(id);
      if (success) {
        const updatedRecipes = this.recipes.filter(recipe => recipe.recipe_id !== id);
        this.recipes = updatedRecipes;
        this.onRecipesChanged(updatedRecipes);
        this.error = null;
        this.onErrorChanged(null);
      } else {
        const updatedRecipes = this.recipes.filter(recipe => recipe.recipe_id !== id);
        this.recipes = updatedRecipes;
        this.onRecipesChanged(updatedRecipes);
        this.error = null;
        this.onErrorChanged(null);
      }
    } catch (error) {
      console.error("Error completo al eliminar receta:", error);
      const updatedRecipes = this.recipes.filter(recipe => recipe.recipe_id !== id);
      this.recipes = updatedRecipes;
      this.onRecipesChanged(updatedRecipes);
      this.error = null;
      this.onErrorChanged(null);
    } finally {
      this.loading = false;
      this.onLoadingChanged(false);
    }
  }

  getLocalRecipes(): Recipe[] {
    return [...this.recipes];
  }
}

export default RecipeViewModel;
