import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { authRoutes } from "./routes/auth.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { settingsRoutes } from "./routes/settings.routes";
import Layout from "@/components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute>
      <Layout />
    </ProtectedRoute>,
    children: [...dashboardRoutes, ...settingsRoutes],
  },
  ...authRoutes, // Auth routes should not be protected
]);