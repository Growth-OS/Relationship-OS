import { createBrowserRouter } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import Prospects from "@/pages/Prospects";
import Deals from "@/pages/Deals";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Calendar from "@/pages/Calendar";
import Finances from "@/pages/Finances";
import Reporting from "@/pages/Reporting";
import Development from "@/pages/Development";
import AIPrompts from "@/pages/AIPrompts";
import AIPersona from "@/pages/AIPersona";
import Sequences from "@/pages/Sequences";
import SequenceBuilder from "@/pages/SequenceBuilder";
import Boards from "@/pages/Boards";
import BoardView from "@/pages/BoardView";
import Travels from "@/pages/Travels";
import Affiliates from "@/pages/Affiliates";
import Invoices from "@/pages/Invoices";
import SubstackPosts from "@/pages/SubstackPosts";
import SubstackPostEditor from "@/pages/SubstackPostEditor";
import SettingsLayout from "@/components/settings/SettingsLayout";
import ProfileSettings from "@/pages/ProfileSettings";
import BrandingSettings from "@/pages/BrandingSettings";
import BackupSettings from "@/pages/BackupSettings";
import OrganisationSettings from "@/pages/OrganisationSettings";

export const router = createBrowserRouter([
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
    element: <Layout><Outlet /></Layout>,
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
            path: "organisation",
            element: <OrganisationSettings />,
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
        path: "prospects",
        element: <Prospects />,
      },
      {
        path: "deals",
        element: <Deals />,
      },
      {
        path: "projects",
        element: <Projects />,
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
        path: "finances",
        element: <Finances />,
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
      {
        path: "sequences",
        element: <Sequences />,
      },
      {
        path: "sequence/:id",
        element: <SequenceBuilder />,
      },
      {
        path: "boards",
        element: <Boards />,
      },
      {
        path: "board/:id",
        element: <BoardView />,
      },
      {
        path: "travels",
        element: <Travels />,
      },
      {
        path: "affiliates",
        element: <Affiliates />,
      },
      {
        path: "invoices",
        element: <Invoices />,
      },
      {
        path: "substack",
        element: <SubstackPosts />,
      },
      {
        path: "substack/post/:id",
        element: <SubstackPostEditor />,
      },
    ],
  },
]);
