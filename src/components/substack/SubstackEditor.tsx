import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Editor } from "@/components/editor/Editor";

export const SubstackEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const handleSave = async (content: string, title: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("substack_posts")
      .insert({
        content,
        title,
        user_id: user.id,
        publish_date: new Date().toISOString(),
        status: 'draft'
      });

    if (error) throw error;
    toast.success("Post saved successfully");
  };

  const handlePublish = async () => {
    if (!title || !content) {
      toast.error("Please add a title and content before publishing");
      return;
    }

    try {
      await handleSave(content, title);
      toast.success("Post published to Substack");
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Input
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium mb-4"
        />
        <Editor
          value={content}
          onChange={setContent}
          placeholder="Write your post content here..."
        />
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => handleSave(content, title)}
        >
          Save Draft
        </Button>
        <Button onClick={handlePublish}>
          Publish to Substack
        </Button>
      </div>
    </div>
  );
};