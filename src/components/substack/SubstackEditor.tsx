import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SubstackEditorProps {
  postId: string;
  initialContent?: string | null;
  title?: string;
}

export const SubstackEditor = ({ postId, initialContent, title }: SubstackEditorProps) => {
  const [content, setContent] = useState(initialContent || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("substack_posts")
        .update({ content })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["substackPosts"] });
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

  const generateContent = async () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Post title is required for content generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke('generate-content', {
        body: { prompt, title },
      });

      if (response.error) throw new Error(response.error.message);
      
      const { data } = response;
      if (data.error) throw new Error(data.error);
      
      setContent(data.generatedText);
      toast({
        title: "Success",
        description: "Content generated successfully",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Wand2 className="w-4 h-4" />
              AI Generate
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Additional context for AI</Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Target audience, tone, key points to cover..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <Button 
                className="w-full"
                onClick={generateContent}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Content"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Content"}
        </Button>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post content here..."
        className="min-h-[300px]"
      />
    </div>
  );
};