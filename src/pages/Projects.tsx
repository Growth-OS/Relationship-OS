import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { ProjectsKanban } from "@/components/projects/ProjectsKanban";
import { ProjectsTimeline } from "@/components/projects/ProjectsTimeline";
import { ProjectsFilter } from "@/components/projects/ProjectsFilter";
import { ProjectsSearch } from "@/components/projects/ProjectsSearch";
import { ProjectsSort } from "@/components/projects/ProjectsSort";
import { CreateProjectButton } from "@/components/projects/CreateProjectButton";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { LayoutGrid, List, Kanban, Calendar } from "lucide-react";

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("last_activity");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", statusFilter, searchQuery, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,client_name.ilike.%${searchQuery}%`);
      }

      switch (sortBy) {
        case "name":
          query = query.order("name");
          break;
        case "client":
          query = query.order("client_name");
          break;
        case "start_date":
          query = query.order("start_date");
          break;
        case "budget":
          query = query.order("budget");
          break;
        default:
          query = query.order("last_activity_date", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your client projects</p>
        </div>
        <CreateProjectButton />
      </div>

      <ProjectStats projects={projects} />

      <Card className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-wrap flex-1">
              <ProjectsSearch value={searchQuery} onChange={setSearchQuery} />
              <ProjectsFilter value={statusFilter} onChange={setStatusFilter} />
              <ProjectsSort value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <Kanban className="h-4 w-4" />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="grid">
                <ProjectsGrid projects={projects} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="list">
                <ProjectsList projects={projects} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="kanban">
                <ProjectsKanban projects={projects} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="timeline">
                <ProjectsTimeline projects={projects} isLoading={isLoading} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Projects;