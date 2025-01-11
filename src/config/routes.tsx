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
import Sequences from "@/pages/Sequences";
import SequenceBuilder from "@/pages/SequenceBuilder";
import Travels from "@/pages/Travels";
import Boards from "@/pages/Boards";
import BoardView from "@/pages/BoardView";
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
import Login from "@/pages/Login";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { ProjectPortal } from "@/components/projects/ProjectPortal";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />
  },
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
            path: "sequences",
            element: <Sequences />,
          },
          {
            path: "sequences/builder",
            element: <SequenceBuilder />,
          },
          {
            path: "projects",
            element: <Projects />,
          },
          {
            path: "projects/:id",
            element: <ProjectPortal />,
          },
          {
            path: "boards",
            element: <Boards />,
          },
          {
            path: "boards/:id",
            element: <BoardView />,
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