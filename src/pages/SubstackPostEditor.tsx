import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SubstackPostFormData, SubstackPostStatus } from "./types";

const SubstackPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [status, setStatus] = React.useState<SubstackPostStatus>("idea");
  const [publishDate, setPublishDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  // Get the current user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const user = session?.user;

  // Only redirect if there's no session and no pending session check
  React.useEffect(() => {
    if (sessionError || (!session && !sessionError)) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to access this page",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [session, sessionError, navigate, toast]);

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
      setContent(post.content || "");
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

      if (id) {
        const { error } = await supabase
          .from("substack_posts")
          .update(postData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("substack_posts")
          .insert([postData]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
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
    mutation.mutate({
      title,
      content,
      status,
      publish_date: publishDate,
      user_id: user.id,
    });
  };

  // Show loading state while checking authentication
  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {id ? "Edit Post" : "Create New Post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Google Doc URL</Label>
          <Input
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your Google Doc URL here"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value: SubstackPostStatus) => setStatus(value)}
          >
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
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input
            id="publishDate"
            type="date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/substack")}
          >
            Cancel
          </Button>
          <Button type="submit">
            {id ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubstackPostEditor;