import { RouteObject } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Prospects from "@/pages/Prospects";
import Deals from "@/pages/Deals";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Travels from "@/pages/Travels";
import Calendar from "@/pages/Calendar";
import Finances from "@/pages/Finances";
import Invoices from "@/pages/Invoices";
import Development from "@/pages/Development";
import Reporting from "@/pages/Reporting";
import AIPrompts from "@/pages/AIPrompts";
import AIPersona from "@/pages/AIPersona";
import SubstackPosts from "@/pages/SubstackPosts";
import SubstackPostEditor from "@/pages/SubstackPostEditor";
import ProjectsQuarterlyTimeline from "@/pages/ProjectsQuarterlyTimeline";
import Affiliates from "@/pages/Affiliates";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
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
        path: "deals",
        element: <Deals />,
      },
      {
        path: "projects",
        element: <Projects />,
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
        path: "finances",
        element: <Finances />,
      },
      {
        path: "invoices",
        element: <Invoices />,
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
        path: "ai-prompts",
        element: <AIPrompts />,
      },
      {
        path: "ai-persona",
        element: <AIPersona />,
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
        path: "substack/:id",
        element: <SubstackPostEditor />,
      },
      {
        path: "affiliates",
        element: <Affiliates />,
      },
    ],
  },
];