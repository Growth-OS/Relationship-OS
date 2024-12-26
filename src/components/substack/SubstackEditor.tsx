import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubstackEditorProps {
  postId: string;
  initialContent?: string | null;
  title?: string;
  onClose?: () => void;
}

export const SubstackEditor = ({ 
  postId, 
  initialContent, 
  title, 
  onClose 
}: SubstackEditorProps) => {
  const [content, setContent] = useState(initialContent || "");
  const [postTitle, setPostTitle] = useState(title || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("substack_posts")
        .update({ 
          content, 
          title: postTitle,
          user_id: user.id 
        })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content saved successfully",
      });

      await queryClient.invalidateQueries({ queryKey: ["substackPosts"] });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-background p-4 border-b shrink-0">
        <div className="flex-1 max-w-2xl">
          <Input
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="text-lg font-semibold"
            placeholder="Enter post title"
          />
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save & Close"}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-[1200px] mx-auto h-full">
          <RichTextEditor
            content={content}
            onChange={setContent}
          />
        </div>
      </div>
    </div>
  );
};