import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Prospects from "@/pages/Prospects";
import Deals from "@/pages/Deals";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import Sequences from "@/pages/Sequences";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Travels from "@/pages/Travels";
import SubstackPosts from "@/pages/SubstackPosts";
import SubstackPostEditor from "@/pages/SubstackPostEditor";
import Affiliates from "@/pages/Affiliates";
import Finances from "@/pages/Finances";
import Invoices from "@/pages/Invoices";
import Reporting from "@/pages/Reporting";
import Development from "@/pages/Development";
import ProjectsQuarterlyTimeline from "@/pages/ProjectsQuarterlyTimeline";
import BackupSettings from "@/pages/BackupSettings";
import BrandingSettings from "@/pages/BrandingSettings";
import ProfileSettings from "@/pages/ProfileSettings";
import Calendar from "@/pages/Calendar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "prospects",
            element: (
              <ProtectedRoute>
                <Prospects />
              </ProtectedRoute>
            ),
          },
          {
            path: "sequences",
            element: (
              <ProtectedRoute>
                <Sequences />
              </ProtectedRoute>
            ),
          },
          {
            path: "deals",
            element: (
              <ProtectedRoute>
                <Deals />
              </ProtectedRoute>
            ),
          },
          {
            path: "projects",
            element: (
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            ),
          },
          {
            path: "quarterly-timeline",
            element: (
              <ProtectedRoute>
                <ProjectsQuarterlyTimeline />
              </ProtectedRoute>
            ),
          },
          {
            path: "tasks",
            element: (
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            ),
          },
          {
            path: "calendar",
            element: (
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            ),
          },
          {
            path: "travels",
            element: (
              <ProtectedRoute>
                <Travels />
              </ProtectedRoute>
            ),
          },
          {
            path: "substack",
            element: (
              <ProtectedRoute>
                <SubstackPosts />
              </ProtectedRoute>
            ),
          },
          {
            path: "substack/new",
            element: (
              <ProtectedRoute>
                <SubstackPostEditor />
              </ProtectedRoute>
            ),
          },
          {
            path: "substack/edit/:id",
            element: (
              <ProtectedRoute>
                <SubstackPostEditor />
              </ProtectedRoute>
            ),
          },
          {
            path: "affiliates",
            element: (
              <ProtectedRoute>
                <Affiliates />
              </ProtectedRoute>
            ),
          },
          {
            path: "finances",
            element: (
              <ProtectedRoute>
                <Finances />
              </ProtectedRoute>
            ),
          },
          {
            path: "invoices",
            element: (
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            ),
          },
          {
            path: "reporting",
            element: (
              <ProtectedRoute>
                <Reporting />
              </ProtectedRoute>
            ),
          },
          {
            path: "development",
            element: (
              <ProtectedRoute>
                <Development />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            children: [
              {
                path: "backup",
                element: (
                  <ProtectedRoute>
                    <BackupSettings />
                  </ProtectedRoute>
                ),
              },
              {
                path: "branding",
                element: (
                  <ProtectedRoute>
                    <BrandingSettings />
                  </ProtectedRoute>
                ),
              },
              {
                path: "profile",
                element: (
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);