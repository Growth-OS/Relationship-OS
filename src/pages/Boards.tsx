import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

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

  const handleBoardClick = (boardId: string) => {
    navigate(`/dashboard/boards/${boardId}`);
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
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brainstorming Boards</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and manage your visual brainstorming sessions
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => handleBoardClick(board.id)}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{board.name}</h3>
            {board.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {board.description}
              </p>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Last edited {format(new Date(board.last_edited_at), 'MMM d, yyyy')}
            </div>
          </div>
        ))}
        {boards.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No boards yet. Create your first board to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Boards;