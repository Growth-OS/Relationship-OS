import { useState } from "react";
import { PostForm } from "./PostForm";
import { ContentPreview } from "./ContentPreview";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const LinkedInPostGenerator = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();

  // Fetch AI persona settings - get the most recent active prompt
  const { data: aiPersona } = useQuery({
    queryKey: ["aiPrompts", "character_profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", "character_profile")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleGenerate = async ({ topic, format }: { topic: string; format: string }) => {
    try {
      if (!aiPersona) {
        toast({
          title: "Error",
          description: "No active AI persona found. Please set up your AI persona in settings first.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          prompt: topic,
          format,
          systemPrompt: aiPersona?.system_prompt 
        }
      });

      if (error) throw error;
      setGeneratedContent(data.generatedText);
      
      toast({
        title: "Content Generated",
        description: "Your LinkedIn post has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PostForm onGenerate={handleGenerate} />
      <ContentPreview content={generatedContent} />
    </div>
  );
};