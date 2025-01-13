import { RouteObject } from "react-router-dom";
import SettingsLayout from "@/components/settings/SettingsLayout";
import ProfileSettings from "@/pages/ProfileSettings";
import BrandingSettings from "@/pages/BrandingSettings";
import BackupSettings from "@/pages/BackupSettings";

export const settingsRoutes: RouteObject[] = [
  {
    path: "dashboard/settings",
    element: <SettingsLayout />,
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
  },
];