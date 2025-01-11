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
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader firstName={firstName} />
      
      <div className="grid gap-8">
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl shadow-sm">
          <DashboardStats />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <DashboardWeeklyTasks />
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <DashboardExternalLinks />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <DashboardActivityChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;