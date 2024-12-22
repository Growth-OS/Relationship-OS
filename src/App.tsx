import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { routes } from "./config/routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            const RouteElement = route.element;
            return (
              <Route 
                key={index}
                path={route.path}
                element={RouteElement}
              >
                {route.children?.map((childRoute, childIndex) => {
                  const ChildElement = childRoute.element;
                  return (
                    <Route
                      key={`${index}-${childIndex}`}
                      path={childRoute.path}
                      element={ChildElement}
                      index={childRoute.index}
                    />
                  );
                })}
              </Route>
            );
          })}
        </Routes>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;