import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GenerateMessageParams {
  template: string;
  prospectData: Record<string, string>;
  stepType: string;
}

export const useMessageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMessage = async ({ template, prospectData, stepType }: GenerateMessageParams) => {
    try {
      setIsGenerating(true);
      console.log('Generating message with:', { template, prospectData, stepType });

      const { data, error } = await supabase.functions.invoke('generate-sequence-message', {
        body: { template, prospectData, stepType }
      });

      if (error) throw error;

      console.log('Generated message:', data.generatedMessage);
      return data.generatedMessage;
    } catch (error) {
      console.error('Error generating message:', error);
      toast.error('Failed to generate message');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMessage,
    isGenerating
  };
};