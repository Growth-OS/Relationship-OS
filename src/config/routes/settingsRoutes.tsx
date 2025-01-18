import { RouteObject } from "react-router-dom";
import BackupSettings from "@/pages/BackupSettings";
import BrandingSettings from "@/pages/BrandingSettings";
import ProfileSettings from "@/pages/ProfileSettings";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const settingsRoutes: RouteObject = {
  path: "dashboard/settings",
  children: [
    {
      path: "backup",
      element: (
        <ProtectedRoute>
          <BackupSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: "branding",
      element: (
        <ProtectedRoute>
          <BrandingSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: "profile",
      element: (
        <ProtectedRoute>
          <ProfileSettings />
        </ProtectedRoute>
      ),
    },
  ],
};