import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfQuarter, endOfQuarter, subQuarters } from "date-fns";
import { EuroIcon, Users2, ListTodo } from "lucide-react";

export const DashboardStats = () => {
  const currentQuarter = new Date();
  const startDate = startOfQuarter(currentQuarter).toISOString();
  const endDate = endOfQuarter(currentQuarter).toISOString();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-quarterly-stats', startDate, endDate],
    queryFn: async () => {
      // Get quarterly revenue
      const { data: revenue } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('type', 'income')
        .gte('date', startDate)
        .lte('date', endDate);

      // Get quarterly deals
      const { count: dealsCount } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      // Get quarterly completed tasks
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const totalRevenue = revenue?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;

      return {
        quarterlyRevenue: totalRevenue,
        quarterlyDeals: dealsCount || 0,
        quarterlyTasks: tasksCount || 0,
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
      title: "Q1 Revenue",
      value: `€${stats?.quarterlyRevenue.toLocaleString() || '0'}`,
      subtitle: "New vs last quarter",
      icon: EuroIcon,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Q1 Deals",
      value: stats?.quarterlyDeals.toString() || '0',
      subtitle: "New vs last quarter",
      icon: Users2,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Q1 Tasks",
      value: stats?.quarterlyTasks.toString() || '0',
      subtitle: "New vs last quarter",
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
            <p className="text-sm text-gray-600 mt-1">{stat.subtitle}</p>
          </Card>
        );
      })}
    </div>
  );
};