import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Join from "@/pages/Join";
import Dashboard from "@/pages/Dashboard";
import Sequences from "@/pages/Sequences";
import SequenceBuilder from "@/pages/SequenceBuilder";
import { Outlet } from "react-router-dom";
import Prospects from "@/pages/Prospects";
import Deals from "@/pages/Deals";
import Projects from "@/pages/Projects";
import Boards from "@/pages/Boards";
import Tasks from "@/pages/Tasks";
import Calendar from "@/pages/Calendar";
import Travels from "@/pages/Travels";
import Affiliates from "@/pages/Affiliates";
import Finances from "@/pages/Finances";
import Invoices from "@/pages/Invoices";
import Reporting from "@/pages/Reporting";
import Development from "@/pages/Development";
import SettingsLayout from "@/components/settings/SettingsLayout";
import ProfileSettings from "@/pages/ProfileSettings";
import Quotes from "@/pages/Quotes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/join",
    element: <Join />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <Layout><Outlet /></Layout>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "quotes",
        element: <Quotes />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "sequences",
        element: <Sequences />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "sequences/:sequenceId/edit",
        element: <SequenceBuilder />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "prospects",
        element: <Prospects />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "deals",
        element: <Deals />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "projects",
        element: <Projects />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "boards",
        element: <Boards />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "tasks",
        element: <Tasks />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "calendar",
        element: <Calendar />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "travels",
        element: <Travels />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "affiliates",
        element: <Affiliates />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "finances",
        element: <Finances />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "invoices",
        element: <Invoices />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "reporting",
        element: <Reporting />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "development",
        element: <Development />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "profile",
            element: <ProfileSettings />,
            errorElement: <ErrorBoundary />,
          }
        ]
      }
    ],
  },
]);
