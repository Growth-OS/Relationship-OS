import { RouteObject } from "react-router-dom";
import Tasks from "@/pages/Tasks";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const taskRoutes: RouteObject = {
  path: "tasks",
  element: (
    <ProtectedRoute>
      <Tasks />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "new",
      element: (
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      ),
    },
  ],
};