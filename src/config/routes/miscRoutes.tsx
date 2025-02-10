import { RouteObject } from "react-router-dom";
import Calendar from "@/pages/Calendar";
import Travels from "@/pages/Travels";
import Affiliates from "@/pages/Affiliates";
import Reporting from "@/pages/Reporting";
import Development from "@/pages/Development";
import OutreachCampaigns from "@/pages/OutreachCampaigns";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const miscRoutes: RouteObject = {
  path: "dashboard",
  children: [
    {
      path: "calendar",
      element: (
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      ),
    },
    {
      path: "travels",
      element: (
        <ProtectedRoute>
          <Travels />
        </ProtectedRoute>
      ),
    },
    {
      path: "affiliates",
      element: (
        <ProtectedRoute>
          <Affiliates />
        </ProtectedRoute>
      ),
    },
    {
      path: "reporting",
      element: (
        <ProtectedRoute>
          <Reporting />
        </ProtectedRoute>
      ),
    },
    {
      path: "development",
      element: (
        <ProtectedRoute>
          <Development />
        </ProtectedRoute>
      ),
    },
    {
      path: "outreach-campaigns",
      element: (
        <ProtectedRoute>
          <OutreachCampaigns />
        </ProtectedRoute>
      ),
    },
  ],
};