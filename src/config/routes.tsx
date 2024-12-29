import { RouteObject } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Prospects from "@/pages/Prospects";
import Tasks from "@/pages/Tasks";
import Inbox from "@/pages/Inbox";

export const routes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Layout />,
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
        path: "inbox",
        element: <Inbox />,
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
        path: "reporting",
        element: <Reporting />,
      },
    ],
  },
];
