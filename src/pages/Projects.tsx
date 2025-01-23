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
import { Button } from "@/components/ui/button";
import { Briefcase, CheckCircle2, Clock, PauseCircle, Grid, List, Kanban } from "lucide-react";
import { cn } from "@/lib/utils";

const Projects = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "on_hold">("active");

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

  // Calculate project statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "active").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const onHoldProjects = projects.filter(p => p.status === "on_hold").length;

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track your client projects</p>
        </div>
        <CreateProjectButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold">{totalProjects}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeProjects}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedProjects}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <PauseCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">On Hold</p>
              <p className="text-2xl font-bold">{onHoldProjects}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
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
          <Button
            variant={statusFilter === "on_hold" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("on_hold")}
            className="flex items-center gap-2"
          >
            <PauseCircle className="w-4 h-4 text-amber-500" />
            On Hold
          </Button>
        </div>

        {/* View Switcher */}
        <Tabs defaultValue="grid" className="w-auto">
          <TabsList className="h-9 bg-background border">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Kanban className="w-4 h-4" />
              Kanban
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-6">
            <ProjectsGrid projects={projects} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <ProjectsList projects={projects} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="kanban" className="mt-6">
            <ProjectsKanban projects={projects} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Projects;