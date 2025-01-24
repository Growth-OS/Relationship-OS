import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { toast } from "sonner";
import { Briefcase, Clock, CheckCircle2 } from "lucide-react";

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("active");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      query = query.order("last_activity_date", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects");
        throw error;
      }

      return data || [];
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your client projects
          </p>
        </div>
        <CreateProjectButton />
      </div>

      {/* Controls Section */}
      <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        {/* Status Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            All
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("active")}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-emerald-500" />
            Active
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            Completed
          </Button>
        </div>

        {/* Projects Grid */}
        <ProjectsGrid projects={projects} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Projects;