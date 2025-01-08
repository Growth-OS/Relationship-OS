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
    ],
  },
]);