import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardChat } from "@/components/dashboard/DashboardChat";
import { DashboardWeeklyTasks } from "@/components/dashboard/DashboardWeeklyTasks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: preparationDeals } = useQuery({
    queryKey: ["preparation-deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("stage", "project_preparation")
        .order("last_activity_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                   user?.email?.split('@')[0] || 
                   'there';

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader firstName={firstName} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        <div className="space-y-4">
          <div className="bg-background rounded-lg p-4 border">
            <Select
              value={selectedProject || "general"}
              onValueChange={(value) => {
                setSelectedProject(value === "general" ? null : value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project or deal to discuss" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Chat</SelectItem>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    📁 {project.name}
                  </SelectItem>
                ))}
                {preparationDeals?.map((deal) => (
                  <SelectItem key={`deal-${deal.id}`} value={`deal-${deal.id}`}>
                    🤝 {deal.company_name} (Deal)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DashboardChat projectId={selectedProject} />
        </div>

        <div>
          <DashboardWeeklyTasks />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;