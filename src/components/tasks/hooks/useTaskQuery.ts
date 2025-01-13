import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskSource } from "@/integrations/supabase/types/tasks";

export const useTaskQuery = (source?: TaskSource, sourceId?: string) => {
  return useQuery({
    queryKey: ['tasks', source, sourceId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('tasks')
        .select(`
          *,
          projects(id, name),
          deals(id, company_name),
          substack_posts(id, title)
        `)
        .eq('user_id', user.id);

      if (source) {
        query = query.eq('source', source);
      }

      if (sourceId) {
        query = query.eq('source_id', sourceId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data;
    },
  });
};