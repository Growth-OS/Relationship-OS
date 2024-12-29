import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardChat } from "@/components/dashboard/DashboardChat";

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
    <div className="flex flex-col gap-6 animate-fade-in">
      <DashboardHeader firstName={firstName} />
      <DashboardStats />
      <DashboardChat 
        messages={[]}
        input=""
        isLoading={false}
        onInputChange={() => {}}
        onSend={() => {}}
      />
    </div>
  );
};

export default Dashboard;