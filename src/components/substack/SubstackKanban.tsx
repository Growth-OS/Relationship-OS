import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";

interface Post {
  id: string;
  title: string;
  status: string;
  publish_date: string;
}

export const SubstackKanban = () => {
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
                  <CreateTaskButton source="substack" variant="ghost" size="icon" />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-2">
                {columnPosts.map((post) => (
                  <Card key={post.id} className="p-3 cursor-pointer hover:bg-gray-100">
                    <h4 className="font-medium text-sm">{post.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(post.publish_date).toLocaleDateString("en-GB")}
                    </p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};