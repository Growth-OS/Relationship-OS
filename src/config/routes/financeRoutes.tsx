import { RouteObject } from "react-router-dom";
import Finances from "@/pages/Finances";
import Invoices from "@/pages/Invoices";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const financeRoutes: RouteObject = {
  path: "dashboard",
  children: [
    {
      path: "finances",
      element: (
        <ProtectedRoute>
          <Finances />
        </ProtectedRoute>
      ),
    },
    {
      path: "finances/new",
      element: (
        <ProtectedRoute>
          <Finances />
        </ProtectedRoute>
      ),
    },
    {
      path: "invoices",
      element: (
        <ProtectedRoute>
          <Invoices />
        </ProtectedRoute>
      ),
    },
    {
      path: "invoices/new",
      element: (
        <ProtectedRoute>
          <Invoices />
        </ProtectedRoute>
      ),
    },
  ],
};