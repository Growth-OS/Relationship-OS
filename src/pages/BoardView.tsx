import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { BoardCanvas } from "@/components/board/BoardCanvas";
import { TooltipProvider } from "@/components/ui/tooltip";

type Board = Database["public"]["Tables"]["boards"]["Row"];

const BoardView = () => {
  const { boardId } = useParams();

  const { data: board, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single();

      if (error) throw error;
      return data as Board;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading board...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Board not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The board you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {board.name}
            </h1>
            {board.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {board.description}
              </p>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last edited: {new Date(board.last_edited_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <BoardCanvas />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BoardView;