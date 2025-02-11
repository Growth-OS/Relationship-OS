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
  
  const { data: invoiceStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', 'invoices'],
    queryFn: async () => {
      try {
        console.log('Fetching invoice data...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: invoices, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['draft', 'sent', 'overdue']);

        if (error) {
          console.error('Error fetching invoices:', error);
          return {
            totalAmount: 0,
            previousAmount: 0,
            trend: generateTrendData(12)
          };
        }

        // Calculate total amount of outstanding invoices
        const totalAmount = invoices?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0;

        return {
          totalAmount,
          previousAmount: 0, // This could be enhanced to show last month's data
          trend: generateTrendData(12)
        };
      } catch (error) {
        console.error('Error in dashboard stats query:', error);
        return {
          totalAmount: 0,
          previousAmount: 0,
          trend: generateTrendData(12)
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 1
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
      value: `€${(invoiceStats?.totalAmount || 0).toLocaleString()}`,
      previousValue: invoiceStats?.previousAmount || 0,
      trend: invoiceStats?.trend || [],
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