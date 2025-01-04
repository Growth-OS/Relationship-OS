import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { SubstackPostStatus, SubstackPostFormData } from "@/components/substack/types";
import { useUser } from "@supabase/auth-helpers-react";
import { SubstackPostForm } from "@/components/substack/form/SubstackPostForm";

const SubstackPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = useUser();
  
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [status, setStatus] = React.useState<SubstackPostStatus>("idea");
  const [publishDate, setPublishDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to access this page",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  const { data: post, isLoading } = useQuery({
    queryKey: ["substack-post", id],
    queryFn: async () => {
      if (!id || !user) return null;
      const { data, error } = await supabase
        .from("substack_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch post",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!id && !!user,
  });

  React.useEffect(() => {
    if (post) {
      setTitle(post.title);
      setUrl(post.url || "");
      setStatus(post.status);
      setPublishDate(post.publish_date);
    }
  }, [post]);

  const mutation = useMutation({
    mutationFn: async (data: SubstackPostFormData) => {
      if (!user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to create or edit posts",
          variant: "destructive",
        });
        throw new Error("User not authenticated");
      }

      const postData = {
        ...data,
        user_id: user.id,
      };

      const { error } = id
        ? await supabase
            .from("substack_posts")
            .update(postData)
            .eq("id", id)
        : await supabase
            .from("substack_posts")
            .insert([postData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["substack-posts"] });
      toast({
        title: "Success",
        description: `Post ${id ? "updated" : "created"} successfully`,
      });
      navigate("/dashboard/substack");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create or edit posts",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      title,
      content: url, // Store the URL in the content field
      status,
      publish_date: publishDate,
      user_id: user.id,
    });
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/substack")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {id ? "Edit Post" : "New Post"}
          </h1>
        </div>
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <SubstackPostForm
            title={title}
            setTitle={setTitle}
            url={url}
            setUrl={setUrl}
            status={status}
            setStatus={setStatus}
            publishDate={publishDate}
            setPublishDate={setPublishDate}
          />
        </form>
      </Card>
    </div>
  );
};

export default SubstackPostEditor;