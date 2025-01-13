import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskSource, TaskData } from "@/components/tasks/types";

interface TaskQueryParams {
  sourceType?: TaskSource;
  sourceId?: string;
  showArchived?: boolean;
}

interface TaskQueryResult {
  tasks: TaskData[];
  total: number;
}

export const useTaskQuery = ({ sourceType, sourceId, showArchived }: TaskQueryParams) => {
  return useQuery<TaskQueryResult>({
    queryKey: ['tasks', sourceType, sourceId, showArchived],
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
        `, { count: 'exact' })
        .eq('user_id', user.id);

      if (sourceType) {
        query = query.eq('source', sourceType);
      }

      if (sourceId) {
        query = query.eq('source_id', sourceId);
      }

      if (!showArchived) {
        query = query.eq('completed', false);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      return {
        tasks: data as TaskData[],
        total: count || 0
      };
    },
  });
};