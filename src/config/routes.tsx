import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { settingsRoutes } from "./routes/settingsRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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