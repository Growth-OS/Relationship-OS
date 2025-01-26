import { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SettingsLayout from "@/components/settings/SettingsLayout";
import BrandingSettings from "@/pages/BrandingSettings";
import BackupSettings from "@/pages/BackupSettings";
import ProfileSettings from "@/pages/ProfileSettings";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const settingsRoutes: RouteObject = {
  element: (
    <ProtectedRoute>
      <SettingsLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="profile" />,
    },
    {
      path: "profile",
      element: <ProfileSettings />,
    },
    {
      path: "branding",
      element: <BrandingSettings />,
    },
    {
      path: "backup",
      element: <BackupSettings />,
    },
  ],
};