import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskData, TaskSource } from "../types";

interface UseTaskQueryProps {
  sourceType?: TaskSource;
  sourceId?: string;
  showArchived?: boolean;
}

export const useTaskQuery = ({ sourceType, sourceId, showArchived = false }: UseTaskQueryProps) => {
  return useQuery({
    queryKey: ["tasks", sourceType, sourceId, showArchived],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        let query = supabase
          .from("tasks")
          .select(`
            *,
            projects(id, name),
            deals(id, company_name),
            substack_posts(id, title),
            sequences(id, name)
          `)
          .eq("user_id", user.id)
          .eq("completed", showArchived);

        // If sourceType is provided and not in archived view, filter by source type
        if (sourceType && !showArchived) {
          query = query.eq("source", sourceType);
        }

        if (sourceId) {
          query = query.eq("source_id", sourceId);
        }

        query = query.order("due_date", { ascending: true });

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching tasks:", error);
          throw error;
        }

        return {
          tasks: data || [],
          total: data?.length || 0
        };
      } catch (error) {
        console.error("Error in task query:", error);
        throw error;
      }
    },
  });
};