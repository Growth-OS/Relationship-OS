import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const DashboardStats = () => {
  // Helper function to format dates for Supabase
  const formatDateForSupabase = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  // Current month's revenue
  const { data: monthlyRevenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const currentMonth = new Date();
      const startDate = formatDateForSupabase(startOfMonth(currentMonth));
      const endDate = formatDateForSupabase(endOfMonth(currentMonth));

      const { data, error } = await supabase
        .from('revenue')
        .select('monthly_revenue')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data?.monthly_revenue || 0;
    },
  });

  // Last month's revenue
  const { data: lastMonthRevenue } = useQuery({
    queryKey: ['last-month-revenue'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const lastMonth = subMonths(new Date(), 1);
      const startDate = formatDateForSupabase(startOfMonth(lastMonth));
      const endDate = formatDateForSupabase(endOfMonth(lastMonth));

      const { data, error } = await supabase
        .from('revenue')
        .select('monthly_revenue')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data?.monthly_revenue || 0;
    },
  });

  // Current month's deals
  const { data: totalDeals, isLoading: isLoadingDeals } = useQuery({
    queryKey: ['total-deals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const currentMonth = new Date();
      const startDate = formatDateForSupabase(startOfMonth(currentMonth));
      const endDate = formatDateForSupabase(endOfMonth(currentMonth));

      const { count, error } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw new Error(error.message);
      return count || 0;
    },
  });

  // Last month's deals
  const { data: lastMonthDeals } = useQuery({
    queryKey: ['last-month-deals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const lastMonth = subMonths(new Date(), 1);
      const startDate = formatDateForSupabase(startOfMonth(lastMonth));
      const endDate = formatDateForSupabase(endOfMonth(lastMonth));

      const { count, error } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw new Error(error.message);
      return count || 0;
    },
  });

  // Current month's completed tasks
  const { data: completedTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['completed-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const currentMonth = new Date();
      const startDate = formatDateForSupabase(startOfMonth(currentMonth));
      const endDate = formatDateForSupabase(endOfMonth(currentMonth));

      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw new Error(error.message);
      return count || 0;
    },
  });

  // Last month's completed tasks
  const { data: lastMonthTasks } = useQuery({
    queryKey: ['last-month-completed-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const lastMonth = subMonths(new Date(), 1);
      const startDate = formatDateForSupabase(startOfMonth(lastMonth));
      const endDate = formatDateForSupabase(endOfMonth(lastMonth));

      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw new Error(error.message);
      return count || 0;
    },
  });

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return "New"; // Handle case where last month was 0
    const change = ((current - previous) / previous) * 100;
    return `${Math.abs(change).toFixed(1)}%`;
  };

  const determineChangeType = (current: number, previous: number) => {
    if (previous === 0) return 'neutral';
    return current >= previous ? 'increase' : 'decrease';
  };

  const stats = [
    {
      name: 'Monthly Revenue',
      value: isLoadingRevenue ? "..." : `€${monthlyRevenue?.toLocaleString() || '0'}`,
      change: calculatePercentageChange(monthlyRevenue || 0, lastMonthRevenue || 0),
      changeType: determineChangeType(monthlyRevenue || 0, lastMonthRevenue || 0),
    },
    {
      name: 'Total Deals',
      value: isLoadingDeals ? "..." : totalDeals?.toString() || '0',
      change: calculatePercentageChange(totalDeals || 0, lastMonthDeals || 0),
      changeType: determineChangeType(totalDeals || 0, lastMonthDeals || 0),
    },
    {
      name: 'Tasks Completed',
      value: isLoadingTasks ? "..." : completedTasks?.toString() || '0',
      change: calculatePercentageChange(completedTasks || 0, lastMonthTasks || 0),
      changeType: determineChangeType(completedTasks || 0, lastMonthTasks || 0),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">{stat.name}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className={`text-sm ${
            stat.changeType === 'increase' 
              ? 'text-green-500' 
              : stat.changeType === 'decrease' 
                ? 'text-red-500' 
                : 'text-gray-500'
          }`}>
            {stat.changeType === 'increase' 
              ? '↑' 
              : stat.changeType === 'decrease' 
                ? '↓' 
                : '•'} {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
};