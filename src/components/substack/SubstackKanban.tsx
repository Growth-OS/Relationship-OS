import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { PostEditor } from "./shared/PostEditor";
import { KanbanColumn } from "./kanban/KanbanColumn";

interface Post {
  id: string;
  title: string;
  status: string;
  publish_date: string;
  content?: string;
}

export const SubstackKanban = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["substackPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("substack_posts")
        .select("*")
        .order("publish_date", { ascending: true });

      if (error) throw error;
      return data as Post[];
    },
  });

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("substack_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["substackPosts"] });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedPostId(null);
  };

  const columns = [
    { title: "Writing", status: "draft" },
    { title: "Editing", status: "editing" },
    { title: "Ready", status: "ready" },
    { title: "Published", status: "published" },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const selectedPost = posts?.find(p => p.id === selectedPostId);

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          status={column.status}
          posts={posts || []}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      ))}

      <PostEditor
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedPost={selectedPost}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};
