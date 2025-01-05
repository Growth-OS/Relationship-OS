import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { BoardCard } from "@/components/boards/BoardCard";
import { CreateBoardDialog } from "@/components/boards/CreateBoardDialog";

type Board = Database["public"]["Tables"]["boards"]["Row"];

const Boards = () => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Boards</h1>
            <p className="text-muted-foreground">
              Create and manage your visual brainstorming sessions
            </p>
          </div>
          <CreateBoardDialog onBoardCreated={refetch} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardCard 
              key={board.id} 
              board={board} 
              onBoardDeleted={refetch}
            />
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
    </div>
  );
};

export default Boards;