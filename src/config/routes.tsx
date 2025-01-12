import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Deals from "@/pages/Deals";
import Prospects from "@/pages/Prospects";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Calendar from "@/pages/Calendar";
import Finances from "@/pages/Finances";
import Development from "@/pages/Development";
import Travels from "@/pages/Travels";
import AIPrompts from "@/pages/AIPrompts";
import AIPersona from "@/pages/AIPersona";
import Affiliates from "@/pages/Affiliates";
import Reporting from "@/pages/Reporting";
import Invoices from "@/pages/Invoices";
import SubstackPosts from "@/pages/SubstackPosts";
import SubstackPostEditor from "@/pages/SubstackPostEditor";
import Index from "@/pages/Index";
import SettingsLayout from "@/components/settings/SettingsLayout";
import ProfileSettings from "@/pages/ProfileSettings";
import BrandingSettings from "@/pages/BrandingSettings";
import BackupSettings from "@/pages/BackupSettings";
import ProjectsQuarterlyTimeline from "@/pages/ProjectsQuarterlyTimeline";
import { Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Outlet /></Layout>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "settings",
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
          {
            path: "deals",
            element: <Deals />,
          },
          {
            path: "prospects",
            element: <Prospects />,
          },
          {
            path: "projects",
            element: <Projects />,
          },
          {
            path: "timelines",
            element: <Navigate to="/dashboard/quarterly-timeline" replace />,
          },
          {
            path: "quarterly-timeline",
            element: <ProjectsQuarterlyTimeline />,
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
            path: "travels",
            element: <Travels />,
          },
          {
            path: "substack",
            element: <SubstackPosts />,
          },
          {
            path: "substack/new",
            element: <SubstackPostEditor />,
          },
          {
            path: "substack/edit/:id",
            element: <SubstackPostEditor />,
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
            path: "invoices",
            element: <Invoices />,
          },
          {
            path: "reporting",
            element: <Reporting />,
          },
          {
            path: "development",
            element: <Development />,
          },
          {
            path: "ai-prompts",
            element: <AIPrompts />,
          },
          {
            path: "ai-persona",
            element: <AIPersona />,
          },
        ],
      },
    ],
  },
]);