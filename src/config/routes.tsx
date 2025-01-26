import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { settingsRoutes } from "./routes/settingsRoutes";
import { contentRoutes } from "./routes/contentRoutes";
import { miscRoutes } from "./routes/miscRoutes";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Login from "@/pages/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
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
      contentRoutes,
      miscRoutes,
      {
        path: "dashboard/settings/*",
        children: [settingsRoutes],
      },
    ],
  },
]);