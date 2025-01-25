import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import SettingsLayout from "@/components/settings/SettingsLayout";
import BackupSettings from "@/pages/BackupSettings";
import BrandingSettings from "@/pages/BrandingSettings";
import ProfileSettings from "@/pages/ProfileSettings";

export const settingsRoutes: RouteObject = {
  path: "settings",
  element: (
    <ProtectedRoute>
      <SettingsLayout />
    </ProtectedRoute>
  ),
  children: [
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