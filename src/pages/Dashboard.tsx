import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardWeeklyTasks } from "@/components/dashboard/DashboardWeeklyTasks";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardActivityChart } from "@/components/dashboard/DashboardActivityChart";
import { DashboardExternalLinks } from "@/components/dashboard/DashboardExternalLinks";

const Dashboard = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                   user?.email?.split('@')[0] || 
                   'there';

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader firstName={firstName} />
      
      <div className="grid gap-6">
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardWeeklyTasks />
          <div className="space-y-6">
            <DashboardExternalLinks />
            <DashboardActivityChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;