import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

const formatDateForSupabase = (date: Date) => {
  return date.toISOString();
};

export const useTaskStats = () => {
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

      if (error) throw error;
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

      if (error) throw error;
      return count || 0;
    },
  });

  return {
    completedTasks,
    lastMonthTasks,
    isLoadingTasks
  };
};