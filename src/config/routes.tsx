import { RouteObject } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Prospects from "@/pages/Prospects";
import Tasks from "@/pages/Tasks";
import Deals from "@/pages/Deals";
import Projects from "@/pages/Projects";
import Calendar from "@/pages/Calendar";
import Substack from "@/pages/Substack";
import Affiliates from "@/pages/Affiliates";
import Finances from "@/pages/Finances";
import Reporting from "@/pages/Reporting";
import Development from "@/pages/Development";
import Invoices from "@/pages/Invoices";
import { Outlet } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Layout><Outlet /></Layout>,
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
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "substack",
        element: <Substack />,
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
    ],
  },
];