import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export const useMonthlyStats = () => {
  // Current month's revenue
  const { data: monthlyRevenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const currentMonth = new Date();
      const startDate = startOfMonth(currentMonth).toISOString();
      const endDate = endOfMonth(currentMonth).toISOString();

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      return data?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
    },
  });

  // Last month's revenue
  const { data: lastMonthRevenue } = useQuery({
    queryKey: ['last-month-revenue'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const lastMonth = subMonths(new Date(), 1);
      const startDate = startOfMonth(lastMonth).toISOString();
      const endDate = endOfMonth(lastMonth).toISOString();

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      return data?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
    },
  });

  return {
    monthlyRevenue,
    lastMonthRevenue,
    isLoadingRevenue
  };
};