import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SequenceStep } from "./SequenceStep";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "./types";
import { toast } from "sonner";

interface CreateCampaignFormProps {
  onSuccess: () => void;
}

export const CreateCampaignForm = ({ onSuccess }: CreateCampaignFormProps) => {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      steps: [
        {
          step_type: "email",
          delay_days: 0,
          message_template: "",
        },
      ],
    },
  });

  const onSubmit = async (data: FormValues) => {
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

      if (campaignError) {
        throw campaignError;
      }

      if (campaign) {
        const stepsWithCampaignId = data.steps.map((step, index) => ({
          ...step,
          campaign_id: campaign.id,
          sequence_order: index,
          step_type: step.step_type, // step_type is now guaranteed to be defined
        }));

        const { error: stepsError } = await supabase
          .from("campaign_steps")
          .insert(stepsWithCampaignId);

        if (stepsError) {
          throw stepsError;
        }
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

  const addStep = () => {
    const steps = form.getValues("steps");
    form.setValue("steps", [
      ...steps,
      {
        step_type: "email",
        delay_days: 0,
        message_template: "",
      },
    ]);
    setExpandedSteps([...expandedSteps, steps.length]);
  };

  const removeStep = (index: number) => {
    const steps = form.getValues("steps");
    form.setValue(
      "steps",
      steps.filter((_, i) => i !== index)
    );
    setExpandedSteps(expandedSteps.filter((i) => i !== index));
  };

  const toggleStep = (index: number) => {
    setExpandedSteps(
      expandedSteps.includes(index)
        ? expandedSteps.filter((i) => i !== index)
        : [...expandedSteps, index]
    );
  };

  const handleGenerateMessage = async (index: number) => {
    setIsGenerating(true);
    // TODO: Implement message generation
    setIsGenerating(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter campaign name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter campaign description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          {form.watch("steps").map((_, index) => (
            <SequenceStep
              key={index}
              index={index}
              form={form}
              expanded={expandedSteps.includes(index)}
              onToggle={() => toggleStep(index)}
              onDelete={() => removeStep(index)}
              onGenerateMessage={() => handleGenerateMessage(index)}
              isGenerating={isGenerating}
            />
          ))}
        </div>

        <Button type="button" variant="outline" onClick={addStep} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
        </Button>
      </form>
    </Form>
  );
};