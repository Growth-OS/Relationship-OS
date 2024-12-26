import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { EditorHeader } from "./editor/EditorHeader";

interface SubstackEditorProps {
  postId: string;
  initialContent?: string | null;
  title?: string;
  onClose?: () => void;
}

export const SubstackEditor = ({ postId, initialContent, title, onClose }: SubstackEditorProps) => {
  const [content, setContent] = useState(initialContent || "");
  const [postTitle, setPostTitle] = useState(title || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("substack_posts")
        .update({ content, title: postTitle })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["substackPosts"] });
      
      // Ensure we cleanup properly after saving
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 100);
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
    <div className="space-y-4 h-full bg-background">
      <EditorHeader
        title={postTitle}
        isSaving={isSaving}
        onSave={handleSave}
        onClose={onClose}
        onTitleChange={setPostTitle}
      />
      
      <div className="px-4 pb-4">
        <RichTextEditor
          content={content}
          onChange={setContent}
        />
      </div>
    </div>
  );
};