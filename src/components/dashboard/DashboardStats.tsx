import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth } from "date-fns";

export const DashboardStats = () => {
  const { data: monthlyRevenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue')
        .select('monthly_revenue')
        .single();

      if (error) throw new Error(error.message);
      return data?.monthly_revenue || 0;
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
      value: '150',
      change: '1.2%',
      changeType: 'decrease',
    },
    {
      name: 'New Clients',
      value: '30',
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