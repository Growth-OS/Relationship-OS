import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/editor/Editor";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubstackPostStatus, SubstackPostFormData } from "@/components/substack/types";
import { useAuth } from "@supabase/auth-helpers-react";

const SubstackPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const auth = useAuth();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [status, setStatus] = React.useState<SubstackPostStatus>("idea");
  const [publishDate, setPublishDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  const { data: post, isLoading } = useQuery({
    queryKey: ["substack-post", id],
    queryFn: async () => {
      if (!id) return null;
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
    enabled: !!id,
  });

  React.useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content || "");
      setStatus(post.status);
      setPublishDate(post.publish_date);
    }
  }, [post]);

  const mutation = useMutation({
    mutationFn: async (data: SubstackPostFormData) => {
      if (!auth.user?.id) throw new Error("User not authenticated");

      const postData = {
        ...data,
        user_id: auth.user.id,
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
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} post`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create or edit posts",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      title,
      content,
      status,
      publish_date: publishDate,
      user_id: auth.user.id,
    });
  };

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
              </label>
              <Select value={status} onValueChange={(value: SubstackPostStatus) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="passed_to_fausta">Passed to Fausta</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="publishDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Publish Date
              </label>
              <Input
                id="publishDate"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content
            </label>
            <Editor
              value={content}
              onChange={setContent}
              placeholder="Write your post content here..."
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SubstackPostEditor;