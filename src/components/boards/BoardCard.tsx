import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Board = Database["public"]["Tables"]["boards"]["Row"];

interface BoardCardProps {
  board: Board;
  onBoardDeleted: () => void;
}

export const BoardCard = ({ board, onBoardDeleted }: BoardCardProps) => {
  const navigate = useNavigate();

  const handleDeleteBoard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', board.id);

      if (error) throw error;

      toast.success("Board deleted successfully");
      onBoardDeleted();
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error("Failed to delete board");
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    navigate(`/dashboard/boards/${board.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20"
    >
      <div className="absolute top-4 right-4" onClick={e => e.stopPropagation()}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="delete-button opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the board
                "{board.name}" and all of its contents.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBoard}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary pr-8">
        {board.name}
      </h3>
      {board.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
          {board.description}
        </p>
      )}
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Last edited {format(new Date(board.last_edited_at), 'MMM d, yyyy')}
      </div>
    </div>
  );
};