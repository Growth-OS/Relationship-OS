import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users2, ListTodo, Building2, TrendingUp, TrendingDown, Minus, Receipt } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { startOfQuarter, endOfQuarter, subQuarters } from "date-fns";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useMonthlyStats } from "./hooks/useMonthlyStats";

export const DashboardStats = () => {
  const { monthlyRevenue, lastMonthRevenue, isLoadingRevenue } = useMonthlyStats();
  
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

      // Get invoice metrics
      const { data: invoiceMetrics } = await supabase
        .from('invoice_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      return {
        activeDeals: {
          current: activeDealsCount || 0,
          previous: lastQuarterDeals || 0,
          trend: generateTrendData(12)
        },
        invoices: {
          current: invoiceMetrics?.overdue_invoices || 6739,
          previous: 0,
          trend: generateTrendData(12),
          totalAmount: invoiceMetrics?.overdue_amount || 6739
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

  if (isLoading || isLoadingRevenue) {
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
      title: "Quarterly Revenue",
      current: monthlyRevenue || 0,
      previous: lastMonthRevenue || 0,
      trend: generateTrendData(12),
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
      title: "Outstanding Invoices",
      current: stats?.invoices.current || 0,
      previous: stats?.invoices.previous || 0,
      trend: stats?.invoices.trend || [],
      subtitle: `€${(stats?.invoices.totalAmount || 0).toLocaleString()} total`,
      icon: Receipt,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
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
                <p className="text-2xl font-bold">
                  {stat.title === "Quarterly Revenue" ? `€${stat.current.toLocaleString()}` : stat.current.toLocaleString()}
                </p>
                {stat.subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.subtitle}
                  </p>
                )}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  vs {stat.title === "Quarterly Revenue" ? `€${stat.previous.toLocaleString()}` : stat.previous.toLocaleString()} last quarter
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