import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

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
    if (isSaving) return;
    
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
    <div className="space-y-4 h-full bg-background">
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background p-4 border-b">
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
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <RichTextEditor
          content={content}
          onChange={setContent}
        />
      </div>
    </div>
  );
};