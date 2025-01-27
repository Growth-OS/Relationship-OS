import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Grid2X2, KanbanSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SubstackPipeline } from "@/components/substack/SubstackPipeline";
import { useState } from "react";

const SubstackPosts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "pipeline">("pipeline");
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ["substack-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("substack_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch Substack posts",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg bg-[#161e2c] border border-gray-800/40 shadow-sm">
        <div className="relative z-10 px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-left">
              <h1 className="text-2xl font-medium text-white">Substack Posts</h1>
              <p className="text-sm text-gray-300 mt-1">
                Manage and create your Substack content
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setView("grid")}
                  className="gap-2"
                >
                  <Grid2X2 className="w-4 h-4" />
                  Grid
                </Button>
                <Button
                  variant={view === "pipeline" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setView("pipeline")}
                  className="gap-2"
                >
                  <KanbanSquare className="w-4 h-4" />
                  Pipeline
                </Button>
              </div>
              <Button 
                onClick={() => navigate("new")}
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        view === "pipeline" ? (
          <SubstackPipeline posts={[]} isLoading={true} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4 space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700" />
                <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-700" />
              </Card>
            ))}
          </div>
        )
      ) : posts?.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No posts yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first Substack post
          </p>
        </Card>
      ) : view === "pipeline" ? (
        <SubstackPipeline posts={posts} isLoading={false} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <Card key={post.id} className="p-4 space-y-3 transition-shadow hover:shadow-md">
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-muted-foreground">
                Status: {post.status}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`edit/${post.id}`)}
                >
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubstackPosts;