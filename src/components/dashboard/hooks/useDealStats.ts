import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfQuarter, endOfQuarter, subQuarters } from "date-fns";

export const useDealStats = () => {
  // Current quarter's deals
  const { data: totalDeals, isLoading: isLoadingDeals } = useQuery({
    queryKey: ['total-deals-quarterly'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const currentQuarter = new Date();
      const startDate = startOfQuarter(currentQuarter).toISOString();
      const endDate = endOfQuarter(currentQuarter).toISOString();

      const { count, error } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;
      return count || 0;
    },
  });

  // Last quarter's deals
  const { data: lastMonthDeals } = useQuery({
    queryKey: ['last-quarter-deals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const lastQuarter = subQuarters(new Date(), 1);
      const startDate = startOfQuarter(lastQuarter).toISOString();
      const endDate = endOfQuarter(lastQuarter).toISOString();

      const { count, error } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;
      return count || 0;
    },
  });

  return {
    totalDeals,
    lastMonthDeals,
    isLoadingDeals
  };
};