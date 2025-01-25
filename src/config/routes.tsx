import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      dashboardRoutes,
      taskRoutes,
    ],
  },
]);