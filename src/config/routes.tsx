import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { settingsRoutes } from "./routes/settingsRoutes";
import { contentRoutes } from "./routes/contentRoutes";
import { miscRoutes } from "./routes/miscRoutes";
import { projectRoutes } from "./routes/projectRoutes";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Login from "@/pages/Login";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/home" replace />,
          },
          {
            path: "home",
            element: <Dashboard />,
          },
          projectRoutes,
          dashboardRoutes,
          contentRoutes,
          miscRoutes,
          {
            path: "settings/*",
            children: [settingsRoutes],
          },
        ],
      },
    ],
  },
]);