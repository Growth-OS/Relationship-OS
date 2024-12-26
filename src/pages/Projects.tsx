import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { ProjectsFilter } from "@/components/projects/ProjectsFilter";
import { useState } from "react";

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", statusFilter],
    queryFn: async () => {
      const query = supabase
        .from("projects")
        .select("*")
        .order("last_activity_date", { ascending: false });

      if (statusFilter !== "all") {
        query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Projects</h1>
          <p className="text-sm text-gray-600">Manage your client projects</p>
        </div>
        <CreateProjectButton />
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <ProjectsFilter value={statusFilter} onChange={setStatusFilter} />
        </div>
        <ProjectsGrid projects={projects} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default Projects;