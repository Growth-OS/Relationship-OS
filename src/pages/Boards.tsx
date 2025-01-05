import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type Board = Database["public"]["Tables"]["boards"]["Row"];

const Boards = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const { data: boards = [], isLoading, refetch } = useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Board[];
    },
  });

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error("You must be logged in to create a board");
        return;
      }

      const { error } = await supabase
        .from('boards')
        .insert({
          name,
          description,
          user_id: user.user.id,
          last_edited_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Board created successfully");
      setOpen(false);
      setName("");
      setDescription("");
      refetch();
    } catch (error) {
      console.error('Error creating board:', error);
      toast.error("Failed to create board");
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId);

      if (error) throw error;

      toast.success("Board deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error("Failed to delete board");
    }
  };

  const handleBoardClick = (e: React.MouseEvent, boardId: string) => {
    // Only navigate if the click wasn't on the delete button
    if (!(e.target as HTMLElement).closest('.delete-button')) {
      navigate(`/dashboard/boards/${boardId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Boards</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage your visual brainstorming sessions
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBoard} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Board Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter board name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter board description (optional)"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">Create Board</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={(e) => handleBoardClick(e, board.id)}
            className="group relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20"
          >
            <div className="absolute top-4 right-4">
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
                      onClick={() => handleDeleteBoard(board.id)}
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
        ))}
        {boards.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No boards yet. Create your first board to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Boards;