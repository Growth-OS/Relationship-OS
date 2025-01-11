import { createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <Dashboard />,
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