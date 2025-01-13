import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { authRoutes } from "./routes/auth.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { settingsRoutes } from "./routes/settings.routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute>
      {[...dashboardRoutes, ...settingsRoutes].map((route) => route.element)}
    </ProtectedRoute>,
  },
  ...authRoutes, // Auth routes should not be protected
]);