import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GenerateTemplateParams {
  industry: string;
  tone: string;
  valueProposition: string;
  targetRole: string;
  painPoints: string;
  stepType: string;
  stepNumber: number;
}

export const useGenerateTemplate = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTemplate = async (params: GenerateTemplateParams) => {
    try {
      setIsGenerating(true);

      const { data, error } = await supabase.functions.invoke('generate-template', {
        body: {
          params,
        },
      });

      if (error) throw error;

      return data.generatedTemplate;
    } catch (error) {
      console.error('Error generating template:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateTemplate,
    isGenerating,
  };
};