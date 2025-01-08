import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

const formatDateForSupabase = (date: Date) => {
  return date.toISOString();
};

export const useMonthlyStats = () => {
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

      if (error) throw error;
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

      if (error) throw error;
      return data?.monthly_revenue || 0;
    },
  });

  return {
    monthlyRevenue,
    lastMonthRevenue,
    isLoadingRevenue
  };
};