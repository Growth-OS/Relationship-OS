import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, ListTodo, Receipt } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMonthlyStats } from "./hooks/useMonthlyStats";
import { useTaskStats } from "./hooks/useTaskStats";
import { StatCard } from "./StatCard";

// Helper function to generate mock trend data
const generateTrendData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    value: Math.floor(Math.random() * 100)
  }));
};

export const DashboardStats = () => {
  const { monthlyRevenue, lastMonthRevenue, isLoadingRevenue } = useMonthlyStats();
  const { completedTasks, lastMonthTasks, isLoadingTasks } = useTaskStats();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Get invoice metrics with better error handling
        const { data: invoiceMetrics, error } = await supabase
          .from('invoice_metrics')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching invoice metrics:', error);
          return {
            invoices: {
              current: 0,
              previous: 0,
              trend: generateTrendData(12),
              totalAmount: 0
            }
          };
        }

        return {
          invoices: {
            current: invoiceMetrics?.overdue_invoices || 0,
            previous: 0,
            trend: generateTrendData(12),
            totalAmount: invoiceMetrics?.overdue_amount || 0
          }
        };
      } catch (error) {
        console.error('Error in dashboard stats query:', error);
        return {
          invoices: {
            current: 0,
            previous: 0,
            trend: generateTrendData(12),
            totalAmount: 0
          }
        };
      }
    },
    retry: 1, // Only retry once if there's an error
  });

  if (isLoading || isLoadingRevenue || isLoadingTasks) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-lg border bg-card">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Quarterly Revenue",
      value: `€${monthlyRevenue?.toLocaleString() || '0'}`,
      previousValue: lastMonthRevenue || 0,
      trend: generateTrendData(12),
      icon: Building2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Tasks Completed",
      value: completedTasks || 0,
      previousValue: lastMonthTasks || 0,
      trend: generateTrendData(12),
      icon: ListTodo,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Outstanding Invoices",
      value: stats?.invoices.current || 0,
      subtitle: `€${(stats?.invoices.totalAmount || 0).toLocaleString()} total`,
      previousValue: stats?.invoices.previous || 0,
      trend: stats?.invoices.trend || [],
      icon: Receipt,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </TooltipProvider>
  );
};