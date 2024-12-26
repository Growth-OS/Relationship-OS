import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { CreatePostButton } from "./CreatePostButton";
import { PostEditor } from "./shared/PostEditor";

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
    { title: "Ideas", status: "idea" },
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
    <div className="grid grid-cols-5 gap-4">
      {columns.map((column) => {
        const columnPosts = posts?.filter((post) => post.status === column.status) || [];

        return (
          <Card key={column.status} className="bg-gray-50">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {column.title} ({columnPosts.length})
                </CardTitle>
                {column.status === "idea" && (
                  <CreatePostButton variant="ghost" size="icon" />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-2">
                {columnPosts.map((post) => (
                  <Card key={post.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{post.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {format(new Date(post.publish_date), "PP")}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(post.id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Content
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <PostEditor
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedPost={selectedPost}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};