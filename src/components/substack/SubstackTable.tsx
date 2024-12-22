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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const SubstackTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  const togglePublishStatus = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("substack_posts")
        .update({ is_published: !currentStatus })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${!currentStatus ? "published" : "unpublished"} successfully`,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Publish Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{format(new Date(post.publish_date), "PPP")}</TableCell>
              <TableCell>
                <Badge 
                  variant={post.is_published ? "default" : "secondary"}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => togglePublishStatus(post.id, post.is_published)}
                >
                  {post.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};