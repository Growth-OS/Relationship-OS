import { RouteObject } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "@/components/Layout";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Affiliates from "@/pages/Affiliates";
import Reporting from "@/pages/Reporting";
import Substack from "@/pages/Substack";
import AIPrompts from "@/pages/AIPrompts";
import AIPersona from "@/pages/AIPersona";
import ProfileSettings from "@/pages/ProfileSettings";
import BrandingSettings from "@/pages/BrandingSettings";
import TeamSettings from "@/pages/TeamSettings";
import Login from "@/pages/Login";
import Deals from "@/pages/Deals";
import Tasks from "@/pages/Tasks";
import Prospects from "@/pages/Prospects";
import Calendar from "@/pages/Calendar";
import Content from "@/pages/Content";
import Finances from "@/pages/Finances";
import Projects from "@/pages/Projects";
import Emails from "@/pages/Emails";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />
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
    errorElement: <ErrorBoundary />,
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
        path: "deals",
        element: <Deals />,
      },
      {
        path: "content",
        element: <Content />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "affiliates",
        element: <Affiliates />,
      },
      {
        path: "finances",
        element: <Finances />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "reporting",
        element: <Reporting />,
      },
      {
        path: "substack",
        element: <Substack />,
      },
      {
        path: "emails",
        element: <Emails />,
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
    errorElement: <ErrorBoundary />,
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
        path: "team",
        element: <TeamSettings />,
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
