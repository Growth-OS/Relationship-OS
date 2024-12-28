import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyBriefing } from "./types";

export const useDailyBriefing = () => {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', false)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: emails } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('is_read', false)
        .eq('is_archived', false)
        .eq('is_trashed', false)
        .is('snoozed_until', null);
      if (error) throw error;
      return data;
    },
  });

  const generateBriefing = (): DailyBriefing => {
    return {
      unreadEmails: emails?.length || 0,
      pendingTasks: {
        total: tasks?.length || 0,
        items: tasks?.slice(0, 5).map(task => ({
          title: task.title,
          due_date: task.due_date,
        })) || [],
      }
    };
  };

  return { generateBriefing };
};