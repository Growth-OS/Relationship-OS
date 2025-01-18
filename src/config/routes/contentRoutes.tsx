import { RouteObject } from "react-router-dom";
import SubstackPosts from "@/pages/SubstackPosts";
import SubstackPostEditor from "@/pages/SubstackPostEditor";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const contentRoutes: RouteObject = {
  path: "dashboard",
  children: [
    {
      path: "substack",
      element: (
        <ProtectedRoute>
          <SubstackPosts />
        </ProtectedRoute>
      ),
    },
    {
      path: "substack/new",
      element: (
        <ProtectedRoute>
          <SubstackPostEditor />
        </ProtectedRoute>
      ),
    },
    {
      path: "substack/edit/:id",
      element: (
        <ProtectedRoute>
          <SubstackPostEditor />
        </ProtectedRoute>
      ),
    },
  ],
};