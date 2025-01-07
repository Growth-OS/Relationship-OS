import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Join from "@/pages/Join";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Deals from "@/pages/Deals";
import Projects from "@/pages/Projects";
import Prospects from "@/pages/Prospects";
import Sequences from "@/pages/Sequences";
import SequenceBuilder from "@/pages/SequenceBuilder";
import Finances from "@/pages/Finances";
import Invoices from "@/pages/Invoices";
import Calendar from "@/pages/Calendar";
import Travels from "@/pages/Travels";
import SubstackPosts from "@/pages/SubstackPosts";
import SubstackPostEditor from "@/pages/SubstackPostEditor";
import AIPersona from "@/pages/AIPersona";
import AIPrompts from "@/pages/AIPrompts";
import TeamSettings from "@/pages/TeamSettings";
import Boards from "@/pages/Boards";
import BoardView from "@/pages/BoardView";
import Development from "@/pages/Development";
import Reporting from "@/pages/Reporting";
import Affiliates from "@/pages/Affiliates";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import ProfileSettings from "@/pages/ProfileSettings";
import BrandingSettings from "@/pages/BrandingSettings";
import BackupSettings from "@/pages/BackupSettings";

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
    path: "/join",
    element: <Join />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          {
            path: "profile",
            element: <ProfileSettings />,
          },
          {
            path: "team",
            element: <TeamSettings />,
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
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "tasks",
        element: <Tasks />,
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
        path: "prospects",
        element: <Prospects />,
      },
      {
        path: "sequences",
        element: <Sequences />,
      },
      {
        path: "sequence-builder",
        element: <SequenceBuilder />,
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
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "travels",
        element: <Travels />,
      },
      {
        path: "substack-posts",
        element: <SubstackPosts />,
      },
      {
        path: "substack-post-editor",
        element: <SubstackPostEditor />,
      },
      {
        path: "ai-persona",
        element: <AIPersona />,
      },
      {
        path: "ai-prompts",
        element: <AIPrompts />,
      },
      {
        path: "boards",
        element: <Boards />,
      },
      {
        path: "board-view",
        element: <BoardView />,
      },
      {
        path: "development",
        element: <Development />,
      },
      {
        path: "reporting",
        element: <Reporting />,
      },
      {
        path: "affiliates",
        element: <Affiliates />,
      },
    ],
  },
]);
