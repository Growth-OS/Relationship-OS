import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubstackPost {
  id: string;
  title: string;
  content: string | null;
  status: string;
  publish_date: string;
  created_at: string;
}

export const SubstackTable = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: posts = [], refetch } = useQuery({
    queryKey: ["substack-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("substack_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SubstackPost[];
    },
  });

  const handleStatusChange = async (postId: string, newStatus: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("substack_posts")
      .update({
        status: newStatus,
        user_id: user.id
      })
      .eq('id', postId);

    if (error) throw error;
    toast.success("Post status updated");
    refetch();
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("substack_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
      toast.success("Post deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Publish Date</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>
              <Select
                defaultValue={post.status}
                onValueChange={(value) => handleStatusChange(post.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue>
                    <Badge className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {format(new Date(post.publish_date), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              {format(new Date(post.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        the post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(post.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};