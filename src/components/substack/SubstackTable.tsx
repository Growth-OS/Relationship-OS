import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubstackEditor } from "./SubstackEditor";

const statusConfig = {
  idea: { label: "Idea", variant: "secondary" },
  draft: { label: "Draft", variant: "default" },
  scheduled: { label: "Scheduled", variant: "warning" },
  live: { label: "Live", variant: "success" },
} as const;

type PostStatus = keyof typeof statusConfig;

export const SubstackTable = () => {
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
        description: `Post status updated to ${statusConfig[newStatus].label}`,
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
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
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
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Publish Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{format(new Date(post.publish_date), "PPP")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                        <Badge 
                          variant={statusConfig[post.status as PostStatus].variant as any}
                          className="cursor-pointer hover:opacity-80"
                        >
                          {statusConfig[post.status as PostStatus].label}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.entries(statusConfig).map(([status, { label }]) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => updatePostStatus(post.id, status as PostStatus)}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(post.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[95vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>
              Edit Content: {selectedPost?.title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 h-full overflow-y-auto">
            {selectedPostId && selectedPost && (
              <SubstackEditor
                postId={selectedPostId}
                initialContent={selectedPost.content}
                title={selectedPost.title}
                onClose={handleCloseDrawer}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
