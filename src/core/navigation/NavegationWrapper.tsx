import { createBrowserRouter } from "react-router-dom";
import RecipePage from "../../features/recipes/presentation/pages/RecipePage";
import Dashboard from "../../features/dashboard/presentation/pages/Dashboard";

export const navigationWrapper = createBrowserRouter([
  {
    path: "/",
    element: <RecipePage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
