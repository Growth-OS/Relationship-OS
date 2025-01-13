import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { MessagePreviewModal } from "./MessagePreviewModal";
import { useMessageGeneration } from "../hooks/useMessageGeneration";
import { SequenceStep } from "./sequence-form/SequenceStep";
import { SequenceDetails } from "./sequence-form/SequenceDetails";
import { FormValues, formSchema } from "./sequence-form/types";

interface CreateSequenceFormProps {
  onSuccess: () => void;
  selectedProspects: string[];
}

export const CreateSequenceForm = ({ onSuccess, selectedProspects }: CreateSequenceFormProps) => {
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

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const { generateMessage, isGenerating } = useMessageGeneration();

  const handleGenerateMessage = async (index: number) => {
    const step = form.getValues(`steps.${index}`);
    
    const exampleData = {
      "First Name": "John",
      "Company Name": "Acme Corp",
      "Website": "www.acme.com",
      "Training Event": "Tech Conference 2024"
    };

    try {
      const generatedMessage = await generateMessage({
        template: step.message_template || "",
        prospectData: exampleData,
        stepType: step.step_type,
      });

      if (generatedMessage) {
        setActiveStepIndex(index);
        form.setValue(`steps.${index}.message_template`, generatedMessage);
        setPreviewModalOpen(true);
      }
    } catch (error) {
      console.error("Error generating message:", error);
      toast.error("Failed to generate message");
    }
  };

  const handleRegenerateMessage = async () => {
    if (activeStepIndex !== null) {
      await handleGenerateMessage(activeStepIndex);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create sequences");
        return;
      }

      const { data: sequence, error: sequenceError } = await supabase
        .from("sequences")
        .insert({
          name: values.name,
          description: values.description,
          user_id: user.id,
          status: "active",
        })
        .select()
        .single();

      if (sequenceError) throw sequenceError;

      const stepsToInsert = values.steps.map((step, index) => ({
        sequence_id: sequence.id,
        step_number: index + 1,
        step_type: step.step_type,
        delay_days: step.delay_days,
        message_template: step.message_template,
      }));

      const { error: stepsError } = await supabase
        .from("sequence_steps")
        .insert(stepsToInsert);

      if (stepsError) throw stepsError;

      if (selectedProspects.length > 0) {
        const assignmentsToInsert = selectedProspects.map(prospectId => ({
          sequence_id: sequence.id,
          prospect_id: prospectId,
          status: "active",
          current_step: 1,
        }));

        const { error: assignmentError } = await supabase
          .from("sequence_assignments")
          .insert(assignmentsToInsert);

        if (assignmentError) throw assignmentError;
      }

      toast.success("Sequence created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error creating sequence:", error);
      toast.error("Failed to create sequence");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SequenceDetails form={form} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Sequence Steps</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentSteps = form.getValues("steps");
                form.setValue("steps", [
                  ...currentSteps,
                  {
                    step_type: "email",
                    delay_days: 0,
                    message_template: "",
                  },
                ]);
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>

          {form.watch("steps").map((step, index) => (
            <SequenceStep
              key={index}
              index={index}
              form={form}
              onDelete={() => {
                const currentSteps = form.getValues("steps");
                form.setValue(
                  "steps",
                  currentSteps.filter((_, i) => i !== index)
                );
              }}
              onGenerateMessage={() => handleGenerateMessage(index)}
              isGenerating={isGenerating}
            />
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit">
            Create Sequence
          </Button>
        </div>
      </form>

      {activeStepIndex !== null && (
        <MessagePreviewModal
          open={previewModalOpen}
          onOpenChange={setPreviewModalOpen}
          message={form.getValues(`steps.${activeStepIndex}.message_template`) || ""}
          onSave={(message) => {
            form.setValue(`steps.${activeStepIndex}.message_template`, message);
          }}
          onRegenerate={handleRegenerateMessage}
          isRegenerating={isGenerating}
        />
      )}
    </Form>
  );
};