import { RouteObject } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "@/components/Layout";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Affiliates from "@/pages/Affiliates";
import Reporting from "@/pages/Reporting";
import Substack from "@/pages/Substack";
import AIPrompts from "@/pages/AIPrompts";
import AIPersona from "@/pages/AIPersona";
import ProfileSettings from "@/pages/ProfileSettings";
import Login from "@/pages/Login";
import CRM from "@/pages/CRM";
import Prospects from "@/pages/Prospects";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthProvider>
        <Layout>
          <Outlet />
        </Layout>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "prospects",
        element: <Prospects />,
      },
      {
        path: "crm",
        element: <CRM />,
      },
      {
        path: "affiliates",
        element: <Affiliates />,
      },
      {
        path: "reporting",
        element: <Reporting />,
      },
      {
        path: "substack",
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