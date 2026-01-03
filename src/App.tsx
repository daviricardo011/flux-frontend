import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./features/auth/auth";
import { router } from "./routes/router";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="text-white">Carregando...</div>;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
