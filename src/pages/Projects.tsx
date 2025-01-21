import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsKanban } from "@/components/projects/ProjectsKanban";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { toast } from "sonner";

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "on_hold">("active");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*");

      // Add status filter if not "all"
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      // Add ordering
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
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
            <p className="text-muted-foreground">Manage and track your client projects</p>
          </div>
          <div className="flex gap-2">
            <CreateProjectButton />
          </div>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="grid" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>

            <select
              className="border rounded-md p-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          <TabsContent value="grid" className="mt-0">
            <ProjectsGrid projects={projects} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <ProjectsList projects={projects} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="kanban" className="mt-0">
            <ProjectsKanban projects={projects} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Projects;