import { RouteObject } from "react-router-dom";
import Projects from "@/pages/Projects";
import ProjectsQuarterlyTimeline from "@/pages/ProjectsQuarterlyTimeline";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const projectRoutes: RouteObject = {
  path: "dashboard",
  children: [
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
  ],
};