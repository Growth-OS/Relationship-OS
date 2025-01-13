import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users2, ListTodo, Building2 } from "lucide-react";

export const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get total prospects
      const { count: prospectsCount } = await supabase
        .from('prospects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get active deals
      const { count: activeDealsCount } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .neq('stage', 'lost');

      // Get pending tasks
      const { count: pendingTasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', false);

      return {
        totalProspects: prospectsCount || 0,
        activeDeals: activeDealsCount || 0,
        pendingTasks: pendingTasksCount || 0,
      };
    },
  });

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </Card>
      ))}
    </div>;
  }

  const statCards = [
    {
      title: "Total Prospects",
      value: stats?.totalProspects.toString() || '0',
      icon: Building2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Active Deals",
      value: stats?.activeDeals.toString() || '0',
      icon: Users2,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks.toString() || '0',
      icon: ListTodo,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        );
      })}
    </div>
  );
};