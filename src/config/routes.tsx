import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import { ProspectsPage } from "@/pages/prospects";
import { ProjectsPage } from "@/pages/projects";
import { ProjectPage } from "@/pages/projects/[id]";
import { DealsPage } from "@/pages/deals";
import { DealPage } from "@/pages/deals/[id]";
import { SettingsPage } from "@/pages/settings";
import { AuthCallback } from "@/pages/auth/callback";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "prospects",
        element: <ProspectsPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "projects/:id",
        element: <ProjectPage />,
      },
      {
        path: "deals",
        element: <DealsPage />,
      },
      {
        path: "deals/:id",
        element: <DealPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
]);