import { RouteObject } from "react-router-dom";
import Tasks from "@/pages/Tasks";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const taskRoutes: RouteObject = {
  path: "dashboard",
  children: [
    {
      path: "tasks",
      element: (
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      ),
    },
    {
      path: "tasks/new",
      element: (
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      ),
    },
  ],
};