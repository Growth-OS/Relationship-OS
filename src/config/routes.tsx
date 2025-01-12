import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Prospects from "@/pages/Prospects";
import Deals from "@/pages/Deals";
import Login from "@/pages/Login";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "prospects",
        element: (
          <ProtectedRoute>
            <Prospects />
          </ProtectedRoute>
        ),
      },
      {
        path: "deals",
        element: (
          <ProtectedRoute>
            <Deals />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);