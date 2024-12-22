import { RouteObject } from "react-router-dom";
import Layout from "@/components/Layout";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import Dashboard from "@/pages/Dashboard";
import Affiliates from "@/pages/Affiliates";
import Reporting from "@/pages/Reporting";
import Substack from "@/pages/Substack";
import AIPrompts from "@/pages/AIPrompts";
import AIPersona from "@/pages/AIPersona";
import ProfileSettings from "@/pages/ProfileSettings";
import Login from "@/pages/Login";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: (
      <AuthProvider>
        <Layout>
          <Outlet />
        </Layout>
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/affiliates",
        element: <Affiliates />,
      },
      {
        path: "/reporting",
        element: <Reporting />,
      },
      {
        path: "/substack",
        element: <Substack />,
      },
    ],
  },
  {
    path: "/settings",
    element: (
      <AuthProvider>
        <SettingsLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "profile",
        element: <ProfileSettings />,
      },
      {
        path: "ai-prompts",
        element: <AIPrompts />,
      },
      {
        path: "ai-persona",
        element: <AIPersona />,
      },
      {
        index: true,
        element: <Navigate to="profile" replace />,
      },
    ],
  },
];