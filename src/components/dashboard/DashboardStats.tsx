import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth } from "date-fns";

export const DashboardStats = () => {
  const { data: monthlyRevenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data, error } = await supabase
        .from('revenue')
        .select('monthly_revenue')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data?.monthly_revenue || 0;
    },
  });

  const { data: totalDeals, isLoading: isLoadingDeals } = useQuery({
    queryKey: ['total-deals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
      return count || 0;
    },
  });

  const { data: completedTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['completed-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw new Error(error.message);
      return count || 0;
    },
  });

  const stats = [
    {
      name: 'Monthly Revenue',
      value: isLoadingRevenue ? "..." : `€${monthlyRevenue?.toLocaleString() || '0'}`,
      change: '2.5%',
      changeType: 'increase',
    },
    {
      name: 'Total Deals',
      value: isLoadingDeals ? "..." : totalDeals?.toString() || '0',
      change: '1.2%',
      changeType: 'decrease',
    },
    {
      name: 'Tasks Completed',
      value: isLoadingTasks ? "..." : completedTasks?.toString() || '0',
      change: '5.0%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">{stat.name}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className={`text-sm ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {stat.changeType === 'increase' ? '↑' : '↓'} {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
};