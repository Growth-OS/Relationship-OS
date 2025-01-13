import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SequenceDetails } from "./form/SequenceDetails";
import { SequenceStep } from "./form/SequenceStep";
import { SequenceFormValues, sequenceFormSchema } from "./form/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CreateSequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSequenceDialog = ({
  open,
  onOpenChange,
}: CreateSequenceDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<SequenceFormValues>({
    resolver: zodResolver(sequenceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      steps: [
        {
          step_number: 1,
          step_type: "email",
          message_template: "",
          delay_days: 0,
        },
      ],
    },
  });

  const onSubmit = async (values: SequenceFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast.error("You must be logged in to create a sequence");
        return;
      }

      // Insert new sequence
      const { data: sequence, error: sequenceError } = await supabase
        .from("sequences")
        .insert({
          name: values.name,
          description: values.description,
          status: values.status,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (sequenceError) throw sequenceError;

      // Insert sequence steps
      const { error: stepsError } = await supabase
        .from("sequence_steps")
        .insert(
          values.steps.map((step, index) => ({
            sequence_id: sequence.id,
            step_number: index + 1,
            step_type: step.step_type,
            message_template: step.message_template,
            delay_days: step.delay_days,
          }))
        );

      if (stepsError) throw stepsError;

      await queryClient.invalidateQueries({ queryKey: ["sequences"] });
      toast.success("Sequence created successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating sequence:", error);
      toast.error("Failed to create sequence");
    }
  };

  const addStep = () => {
    const steps = form.getValues("steps");
    form.setValue("steps", [
      ...steps,
      {
        step_number: steps.length + 1,
        step_type: "email",
        message_template: "",
        delay_days: 0,
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Sequence</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SequenceDetails form={form} />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Steps</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
              
              {form.watch("steps").map((step, index) => (
                <SequenceStep
                  key={index}
                  index={index}
                  form={form}
                  onDelete={() => {
                    const steps = form.getValues("steps");
                    form.setValue(
                      "steps",
                      steps.filter((_, i) => i !== index)
                    );
                  }}
                />
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Sequence</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};