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

interface EditSequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sequence: {
    id: string;
    name: string;
    description?: string;
    status: string;
    sequence_steps: Array<any>;
    sequence_assignments: Array<any>;
  };
}

export const EditSequenceDialog = ({
  open,
  onOpenChange,
  sequence,
}: EditSequenceDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<SequenceFormValues>({
    resolver: zodResolver(sequenceFormSchema),
    defaultValues: {
      name: sequence.name,
      description: sequence.description,
      status: sequence.status as "active" | "paused" | "completed",
      steps: sequence.sequence_steps.map((step) => ({
        step_number: step.step_number,
        step_type: step.step_type,
        message_template: step.message_template,
        delay_days: step.delay_days,
      })),
    },
  });

  const onSubmit = async (values: SequenceFormValues) => {
    try {
      // Update sequence details
      const { error: sequenceError } = await supabase
        .from("sequences")
        .update({
          name: values.name,
          description: values.description,
          status: values.status,
        })
        .eq("id", sequence.id);

      if (sequenceError) throw sequenceError;

      // Delete existing steps
      const { error: deleteError } = await supabase
        .from("sequence_steps")
        .delete()
        .eq("sequence_id", sequence.id);

      if (deleteError) throw deleteError;

      // Insert new steps
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
      toast.success("Sequence updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating sequence:", error);
      toast.error("Failed to update sequence");
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
          <DialogTitle>Edit Sequence: {sequence.name}</DialogTitle>
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
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};