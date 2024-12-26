import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wand2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/content/RichTextEditor";

interface SubstackEditorProps {
  postId: string;
  initialContent?: string | null;
  title?: string;
  onClose?: () => void;
}

export const SubstackEditor = ({ postId, initialContent, title, onClose }: SubstackEditorProps) => {
  const [content, setContent] = useState(initialContent || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selectedPromptId, setSelectedPromptId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prompts } = useQuery({
    queryKey: ["aiPrompts", "general_prompt"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq('category', 'general_prompt')
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
      if (onClose) onClose();
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
      const selectedPrompt = prompts?.find(p => p.id === selectedPromptId);
      const systemPrompt = selectedPrompt?.system_prompt || "";

      const response = await supabase.functions.invoke('generate-content', {
        body: { 
          prompt, 
          title,
          systemPrompt 
        },
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
        <div className="flex items-center space-x-2">
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
                  <Label>Select AI Prompt Template</Label>
                  <Select
                    value={selectedPromptId}
                    onValueChange={setSelectedPromptId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a prompt template" />
                    </SelectTrigger>
                    <SelectContent>
                      {prompts?.map((prompt) => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                          {prompt.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Additional context for AI</Label>
                  <RichTextEditor
                    content={prompt}
                    onChange={(value) => setPrompt(value)}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={generateContent}
                  disabled={isGenerating || !selectedPromptId}
                >
                  {isGenerating ? "Generating..." : "Generate Content"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save & Close"}
          </Button>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <RichTextEditor
        content={content}
        onChange={setContent}
      />
    </div>
  );
};