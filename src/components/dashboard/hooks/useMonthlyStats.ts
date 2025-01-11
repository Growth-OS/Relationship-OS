import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfQuarter, endOfQuarter, subQuarters } from "date-fns";

export const useMonthlyStats = () => {
  // Current quarter's revenue
  const { data: monthlyRevenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['quarterly-revenue'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const currentQuarter = new Date();
      const startDate = startOfQuarter(currentQuarter).toISOString();
      const endDate = endOfQuarter(currentQuarter).toISOString();

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

  // Last quarter's revenue
  const { data: lastMonthRevenue } = useQuery({
    queryKey: ['last-quarter-revenue'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const lastQuarter = subQuarters(new Date(), 1);
      const startDate = startOfQuarter(lastQuarter).toISOString();
      const endDate = endOfQuarter(lastQuarter).toISOString();

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