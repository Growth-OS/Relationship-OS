import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const dashboardRoutes: RouteObject = {
  path: "dashboard",
  children: [
    {
      index: true,
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
  ],
};