import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { ProjectsSearch } from "@/components/projects/ProjectsSearch";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProjectForm } from "@/components/projects/CreateProjectForm";
import { ProjectStatus } from "@/integrations/supabase/types/projects";
import { Prospect } from "@/types/prospects";

const Projects = () => {
  const [filters, setFilters] = useState<Array<{ field: string; value: string }>>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [sortBy, setSortBy] = useState<string>("last_activity");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", statusFilter, filters, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      // Apply filters from search component
      filters.forEach(filter => {
        query = query.ilike(filter.field, `%${filter.value}%`);
      });

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

      // Transform Project data to match Prospect interface
      return data.map(project => ({
        id: project.id,
        company_name: project.name,
        contact_email: null,
        source: 'other',
        status: project.status,
        company_website: null,
        first_name: null,
        training_event: null,
        created_at: project.created_at,
        user_id: project.user_id
      })) as Prospect[];
    },
  });

  const acceleratorOptions = ["Program A", "Program B", "Program C"]; // Add your actual options

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
            <p className="text-muted-foreground">Manage and track your client projects</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <CreateProjectForm />
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <ProjectsSearch 
            filters={filters}
            onFilterChange={setFilters}
            acceleratorOptions={acceleratorOptions}
          />
          <ProjectsList 
            projects={projects} 
            isLoading={isLoading} 
            filters={filters}
          />
        </div>
      </Card>
    </div>
  );
};

export default Projects;