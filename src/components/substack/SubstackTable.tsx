import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostStatus } from "./table/StatusBadge";
import { PostEditor } from "./shared/PostEditor";
import { useState } from "react";
import { TableHeader } from "./table/TableHeader";
import { TableRow } from "./table/TableRow";

export const SubstackTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ["substackPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("substack_posts")
        .select("*")
        .order("publish_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updatePostStatus = async (postId: string, newStatus: PostStatus) => {
    try {
      const { error } = await supabase
        .from("substack_posts")
        .update({ status: newStatus })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post status updated`,
      });

      queryClient.invalidateQueries({ queryKey: ["substackPosts"] });
    } catch (error) {
      console.error("Error updating post status:", error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    }
  };

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
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPostId(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const selectedPost = posts?.find(p => p.id === selectedPostId);

  return (
    <div className="space-y-8">
      <div className="rounded-md border">
        <Table>
          <TableHeader />
          <TableBody>
            {posts?.map((post) => (
              <TableRow
                key={post.id}
                post={post}
                onStatusChange={updatePostStatus}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <PostEditor
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPost={selectedPost}
        onClose={handleCloseDialog}
      />
    </div>
  );
};