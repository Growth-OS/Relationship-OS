import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { settingsRoutes } from "./routes/settingsRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      dashboardRoutes,
      settingsRoutes,
    ],
  },
]);