import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: prospects } = await supabase
        .from('prospects')
        .select('*');

      const { data: deals } = await supabase
        .from('deals')
        .select('*');

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', false);

      return {
        totalProspects: prospects?.length || 0,
        totalDeals: deals?.length || 0,
        pendingTasks: tasks?.length || 0,
      };
    },
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Prospects</h3>
        <p className="text-2xl font-bold">{stats?.totalProspects}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Active Deals</h3>
        <p className="text-2xl font-bold">{stats?.totalDeals}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Pending Tasks</h3>
        <p className="text-2xl font-bold">{stats?.pendingTasks}</p>
      </Card>
    </div>
  );
};