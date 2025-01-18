import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { Navigate } from "react-router-dom";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { projectRoutes } from "./routes/projectRoutes";
import { crmRoutes } from "./routes/crmRoutes";
import { contentRoutes } from "./routes/contentRoutes";
import { financeRoutes } from "./routes/financeRoutes";
import { settingsRoutes } from "./routes/settingsRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { miscRoutes } from "./routes/miscRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      dashboardRoutes,
      projectRoutes,
      crmRoutes,
      contentRoutes,
      financeRoutes,
      settingsRoutes,
      taskRoutes,
      miscRoutes,
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);