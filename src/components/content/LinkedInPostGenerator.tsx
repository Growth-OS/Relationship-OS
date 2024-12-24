import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "./linkedin/PostForm";
import { ContentPreview } from "./linkedin/ContentPreview";

const LinkedInPostGenerator = () => {
  const [generatedContent, setGeneratedContent] = useState("");

  // Fetch AI persona settings
  const { data: aiPersona } = useQuery({
    queryKey: ["aiPrompts", "character_profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", "character_profile")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleGenerate = async ({ topic, format }: { topic: string; format: string }) => {
    // TODO: Implement AI generation logic
    console.log("Generating with persona:", aiPersona);
    console.log("Topic:", topic);
    console.log("Format:", format);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PostForm onGenerate={handleGenerate} />
      <ContentPreview content={generatedContent} />
    </div>
  );
};

export default LinkedInPostGenerator;