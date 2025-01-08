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
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "sequences",
        element: <Sequences />,
      },
      {
        path: "sequences/:sequenceId/edit",
        element: <SequenceBuilder />,
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
        path: "boards",
        element: <Boards />,
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
      }
    ],
  },
]);