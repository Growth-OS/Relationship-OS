import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { settingsRoutes } from "./routes/settingsRoutes";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      dashboardRoutes,
      settingsRoutes,
    ],
  },
]);