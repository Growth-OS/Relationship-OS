import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Templates from "@/pages/Templates";
import Projects from "@/pages/Projects";
import Deals from "@/pages/Deals";
import Prospects from "@/pages/Prospects";
import OutreachCampaigns from "@/pages/OutreachCampaigns";
import ProjectsQuarterlyTimeline from "@/pages/ProjectsQuarterlyTimeline";
import Calendar from "@/pages/Calendar";
import Reporting from "@/pages/Reporting";
import Finances from "@/pages/Finances";
import Affiliates from "@/pages/Affiliates";
import Development from "@/pages/Development";
import Invoices from "@/pages/Invoices";

export const dashboardRoutes: RouteObject = {
  path: "dashboard",
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    {
      path: "templates",
      element: <Templates />,
    },
    {
      path: "projects",
      element: <Projects />,
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
      path: "outreach-campaigns",
      element: <OutreachCampaigns />,
    },
    {
      path: "quarterly-timeline",
      element: <ProjectsQuarterlyTimeline />,
    },
    {
      path: "calendar",
      element: <Calendar />,
    },
    {
      path: "reporting",
      element: <Reporting />,
    },
    {
      path: "finances",
      element: <Finances />,
    },
    {
      path: "affiliates",
      element: <Affiliates />,
    },
    {
      path: "development",
      element: <Development />,
    },
    {
      path: "invoices",
      element: <Invoices />,
    },
  ],
};