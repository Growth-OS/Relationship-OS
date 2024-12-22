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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};