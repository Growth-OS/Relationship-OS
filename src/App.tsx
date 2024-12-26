import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { routes } from "./config/routes";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;