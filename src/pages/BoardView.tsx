import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { BoardCanvas } from "@/components/board/BoardCanvas";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Board = Database["public"]["Tables"]["boards"]["Row"];

const BoardView = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  // Redirect if no boardId is provided
  if (!boardId) {
    toast.error("No board ID provided");
    navigate('/dashboard/boards');
    return null;
  }

  const { data: board, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load board");
        throw error;
      }

      if (!data) {
        toast.error("Board not found");
        navigate('/dashboard/boards');
        return null;
      }

      return data as Board;
    },
  });

  const handleBackClick = () => {
    navigate('/dashboard/boards');
  };

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
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The board you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button variant="outline" className="mt-4" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Boards
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
            className="hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {board.name}
            </h1>
            {board.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {board.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
          <BoardCanvas />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BoardView;