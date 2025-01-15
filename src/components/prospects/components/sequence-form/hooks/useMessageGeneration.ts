import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMessageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMessage = async (prompt: string, stepType: string) => {
    try {
      setIsGenerating(true);
      console.log('Generating message with prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('generate-sequence-message', {
        body: {
          prompt,
          stepType,
        },
      });

      if (error) {
        console.error('Error generating message:', error);
        throw error;
      }

      console.log('Generated message:', data);
      return data.generatedMessage;
    } catch (error) {
      console.error('Error in message generation:', error);
      toast.error('Failed to generate message. Please try again.');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMessage,
    isGenerating,
  };
};