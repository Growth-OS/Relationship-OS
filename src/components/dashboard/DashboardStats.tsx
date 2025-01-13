import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users2, ListTodo, Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { startOfQuarter, endOfQuarter, subQuarters } from "date-fns";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current quarter data
      const currentQuarter = new Date();
      const startDate = startOfQuarter(currentQuarter);
      const endDate = endOfQuarter(currentQuarter);

      // Get last quarter data for comparison
      const lastQuarter = subQuarters(currentQuarter, 1);
      const lastStartDate = startOfQuarter(lastQuarter);
      const lastEndDate = endOfQuarter(lastQuarter);

      // Get total prospects
      const { count: prospectsCount } = await supabase
        .from('prospects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: lastQuarterProspects } = await supabase
        .from('prospects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', lastStartDate.toISOString())
        .lte('created_at', lastEndDate.toISOString());

      // Get active deals
      const { count: activeDealsCount } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .neq('stage', 'lost');

      const { count: lastQuarterDeals } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .neq('stage', 'lost')
        .gte('created_at', lastStartDate.toISOString())
        .lte('created_at', lastEndDate.toISOString());

      // Get pending tasks
      const { count: pendingTasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', false);

      const { count: lastQuarterTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', false)
        .gte('created_at', lastStartDate.toISOString())
        .lte('created_at', lastEndDate.toISOString());

      return {
        totalProspects: {
          current: prospectsCount || 0,
          previous: lastQuarterProspects || 0,
          trend: generateTrendData(12)
        },
        activeDeals: {
          current: activeDealsCount || 0,
          previous: lastQuarterDeals || 0,
          trend: generateTrendData(12)
        },
        pendingTasks: {
          current: pendingTasksCount || 0,
          previous: lastQuarterTasks || 0,
          trend: generateTrendData(12)
        }
      };
    },
  });

  // Helper function to generate mock trend data
  const generateTrendData = (points: number) => {
    return Array.from({ length: points }, (_, i) => ({
      value: Math.floor(Math.random() * 100)
    }));
  };

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

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
      current: stats?.totalProspects.current || 0,
      previous: stats?.totalProspects.previous || 0,
      trend: stats?.totalProspects.trend || [],
      icon: Building2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Active Deals",
      current: stats?.activeDeals.current || 0,
      previous: stats?.activeDeals.previous || 0,
      trend: stats?.activeDeals.trend || [],
      icon: Users2,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Pending Tasks",
      current: stats?.pendingTasks.current || 0,
      previous: stats?.pendingTasks.previous || 0,
      trend: stats?.pendingTasks.trend || [],
      icon: ListTodo,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const percentChange = calculateChange(stat.current, stat.previous);
          const TrendIcon = percentChange > 0 ? TrendingUp : percentChange < 0 ? TrendingDown : Minus;
          const trendColor = percentChange > 0 ? 'text-green-500' : percentChange < 0 ? 'text-red-500' : 'text-gray-500';

          return (
            <Card 
              key={index} 
              className="p-6 hover:shadow-lg transition-shadow duration-200 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                      <span className={`text-sm ${trendColor}`}>
                        {Math.abs(percentChange).toFixed(1)}%
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compared to last quarter</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold">{stat.current.toLocaleString()}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  vs {stat.previous.toLocaleString()} last quarter
                </div>
              </div>

              <div className="h-16 mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stat.trend}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={stat.color.replace('text-', '#')} 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  );
};