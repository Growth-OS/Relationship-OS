import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SequenceStep } from "./SequenceStep";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues, formSchema } from "./types";
import { CampaignDetails } from "./components/CampaignDetails";
import { useCampaignCreation } from "./hooks/useCampaignCreation";
import { useMessageGeneration } from "./hooks/useMessageGeneration";
import { toast } from "sonner";

interface CreateCampaignFormProps {
  onSuccess: () => void;
}

export const CreateCampaignForm = ({ onSuccess }: CreateCampaignFormProps) => {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const { createCampaign, isSubmitting } = useCampaignCreation(onSuccess);
  const { generateMessage, isGenerating } = useMessageGeneration();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      steps: [
        {
          step_type: "email",
          delay_days: 0,
          message_template_or_prompt: "",
          is_ai_enabled: false,
          message_prompt: "",
        },
      ],
    },
  });

  const addStep = () => {
    const steps = form.getValues("steps");
    form.setValue("steps", [
      ...steps,
      {
        step_type: "email",
        delay_days: 0,
        message_template_or_prompt: "",
        is_ai_enabled: false,
        message_prompt: "",
      },
    ]);
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
    try {
      const step = form.getValues(`steps.${index}`);
      if (!step.message_prompt) {
        toast.error("Please provide a message prompt for AI generation");
        return;
      }

      const generatedMessage = await generateMessage(
        step.message_prompt,
        step.step_type
      );

      form.setValue(`steps.${index}.message_template_or_prompt`, generatedMessage);
      toast.success("Message generated successfully");
    } catch (error) {
      console.error("Error generating message:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createCampaign)} className="space-y-4">
        <CampaignDetails form={form} />

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