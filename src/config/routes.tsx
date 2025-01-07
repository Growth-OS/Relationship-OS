import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Login from "@/pages/Login";
import Join from "@/pages/Join";
import Dashboard from "@/pages/Dashboard";
import TeamSettings from "@/pages/TeamSettings";
import Invoices from "@/pages/Invoices";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Prospects from "@/pages/Prospects";
import Deals from "@/pages/Deals";
import Finances from "@/pages/Finances";
import Sequences from "@/pages/Sequences";
import Calendar from "@/pages/Calendar";
import Boards from "@/pages/Boards";
import BoardView from "@/pages/BoardView";
import Travels from "@/pages/Travels";
import SubstackPosts from "@/pages/SubstackPosts";
import SubstackPostEditor from "@/pages/SubstackPostEditor";
import AIPrompts from "@/pages/AIPrompts";
import Development from "@/pages/Development";
import Reporting from "@/pages/Reporting";
import Affiliates from "@/pages/Affiliates";

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Layout>
          <Outlet />
        </Layout>
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/prospects",
        element: <Prospects />,
      },
      {
        path: "/dashboard/sequences",
        element: <Sequences />,
      },
      {
        path: "/dashboard/deals",
        element: <Deals />,
      },
      {
        path: "/dashboard/projects",
        element: <Projects />,
      },
      {
        path: "/dashboard/boards",
        element: <Boards />,
      },
      {
        path: "/dashboard/board/:id",
        element: <BoardView />,
      },
      {
        path: "/dashboard/tasks",
        element: <Tasks />,
      },
      {
        path: "/dashboard/calendar",
        element: <Calendar />,
      },
      {
        path: "/dashboard/travels",
        element: <Travels />,
      },
      {
        path: "/dashboard/substack",
        element: <SubstackPosts />,
      },
      {
        path: "/dashboard/substack/editor",
        element: <SubstackPostEditor />,
      },
      {
        path: "/dashboard/affiliates",
        element: <Affiliates />,
      },
      {
        path: "/dashboard/finances",
        element: <Finances />,
      },
      {
        path: "/dashboard/invoices",
        element: <Invoices />,
      },
      {
        path: "/dashboard/reporting",
        element: <Reporting />,
      },
      {
        path: "/dashboard/development",
        element: <Development />,
      },
      {
        path: "/dashboard/ai-prompts",
        element: <AIPrompts />,
      },
      {
        path: "/team-settings",
        element: <TeamSettings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/join",
    element: <Join />,
  },
]);