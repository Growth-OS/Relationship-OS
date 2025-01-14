import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCampaignCreation = (onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const createCampaign = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create campaigns');
        return;
      }

      const { data: campaign, error: campaignError } = await supabase
        .from("outreach_campaigns")
        .insert({
          name: data.name,
          description: data.description,
          user_id: user.id,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      if (campaign) {
        const stepsWithCampaignId = data.steps.map((step, index) => ({
          ...step,
          campaign_id: campaign.id,
          sequence_order: index,
          step_type: step.step_type,
        }));

        const { error: stepsError } = await supabase
          .from("campaign_steps")
          .insert(stepsWithCampaignId);

        if (stepsError) throw stepsError;
      }

      await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createCampaign, isSubmitting };
};