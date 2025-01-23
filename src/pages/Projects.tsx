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
    <div className="space-y-6 animate-fade-in">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Projects
                </h1>
                <p className="text-muted-foreground">
                  Manage and track your client projects
                </p>
              </div>
              <CreateProjectButton />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{totalProjects}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{activeProjects}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedProjects}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <PauseCircle className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">On Hold</p>
                    <p className="text-2xl font-bold">{onHoldProjects}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <Card className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "rounded-md transition-colors",
                  statusFilter === "all" && "bg-white dark:bg-gray-700 shadow-sm"
                )}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("active")}
                className={cn(
                  "rounded-md transition-colors",
                  statusFilter === "active" && "bg-white dark:bg-gray-700 shadow-sm"
                )}
              >
                <Clock className="w-4 h-4 mr-2" />
                Active
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("completed")}
                className={cn(
                  "rounded-md transition-colors",
                  statusFilter === "completed" && "bg-white dark:bg-gray-700 shadow-sm"
                )}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("on_hold")}
                className={cn(
                  "rounded-md transition-colors",
                  statusFilter === "on_hold" && "bg-white dark:bg-gray-700 shadow-sm"
                )}
              >
                <PauseCircle className="w-4 h-4 mr-2" />
                On Hold
              </Button>
            </div>

            {/* View Switcher */}
            <Tabs defaultValue="grid" className="w-auto">
              <TabsList className="grid grid-cols-3 h-9 items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 min-w-[200px]">
                <TabsTrigger value="grid" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                  <Grid className="w-4 h-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                  <List className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="kanban" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                  <Kanban className="w-4 h-4 mr-2" />
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
      </Card>
    </div>
  );
};

export default Projects;