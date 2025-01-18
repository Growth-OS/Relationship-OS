import { RouteObject } from "react-router-dom";
import Prospects from "@/pages/Prospects";
import Deals from "@/pages/Deals";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const crmRoutes: RouteObject = {
  path: "dashboard",
  children: [
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
    {
      path: "deals/new",
      element: (
        <ProtectedRoute>
          <Deals />
        </ProtectedRoute>
      ),
    },
  ],
};