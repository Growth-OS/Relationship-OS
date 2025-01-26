import { RouteObject } from "react-router-dom";
import Projects from "@/pages/Projects";
import ProjectView from "@/pages/ProjectView";
import ProjectsQuarterlyTimeline from "@/pages/ProjectsQuarterlyTimeline";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const projectRoutes: RouteObject = {
  path: "projects",
  children: [
    {
      index: true,
      element: (
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      ),
    },
    {
      path: ":projectId/*",
      element: (
        <ProtectedRoute>
          <ProjectView />
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