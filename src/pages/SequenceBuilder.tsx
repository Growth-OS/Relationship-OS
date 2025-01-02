import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { AddStepDialog } from "@/components/sequences/AddStepDialog";
import { SequenceStepsList } from "@/components/sequences/SequenceStepsList";
import { useState } from "react";
import { addDays, format } from "date-fns";
import { StepType, SequenceStep } from "@/components/sequences/types";

const SequenceBuilder = () => {
  const { sequenceId } = useParams();
  const queryClient = useQueryClient();
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);

  const { data: sequence, isLoading: sequenceLoading } = useQuery({
    queryKey: ["sequence", sequenceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps (
            *
          )
        `)
        .eq("id", sequenceId)
        .single();

      if (error) throw error;

      // Map database step types to frontend step types
      if (data.sequence_steps) {
        data.sequence_steps = data.sequence_steps.map((step: any) => ({
          ...step,
          step_type: mapDbStepTypeToFrontend(step.step_type, step.step_number)
        }));
      }

      return data;
    },
  });

  // Helper function to map database step type to frontend step type
  const mapDbStepTypeToFrontend = (dbType: "email" | "linkedin", stepNumber: number): StepType => {
    if (dbType === "email") {
      return stepNumber % 2 === 1 ? "email_1" : "email_2";
    } else {
      if (stepNumber === 1) return "linkedin_connection";
      return stepNumber % 2 === 1 ? "linkedin_message_1" : "linkedin_message_2";
    }
  };

  // Helper function to map frontend step type to database step type
  const mapFrontendStepTypeToDb = (frontendType: StepType): "email" | "linkedin" => {
    return frontendType.startsWith('email') ? "email" : "linkedin";
  };

  const addStepMutation = useMutation({
    mutationFn: async (values: {
      step_type: StepType;
      message_template: string;
      delay_days: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to create steps');
      }

      const nextStepNumber = sequence?.sequence_steps?.length + 1 || 1;

      // Map frontend step type to database enum value
      const dbStepType = mapFrontendStepTypeToDb(values.step_type);

      const { data: stepData, error: stepError } = await supabase
        .from("sequence_steps")
        .insert({
          sequence_id: sequenceId,
          step_number: nextStepNumber,
          step_type: dbStepType,
          message_template: values.message_template,
          delay_days: values.delay_days,
        })
        .select()
        .single();

      if (stepError) throw stepError;

      // Create a task for this step
      const dueDate = addDays(new Date(), values.delay_days);
      const actionType = values.step_type.startsWith('email') ? 'Send email' : 
                        values.step_type === 'linkedin_connection' ? 'Send LinkedIn connection request' : 
                        'Send LinkedIn message';
      
      const { error: taskError } = await supabase
        .from("tasks")
        .insert({
          title: `${actionType} for sequence "${sequence?.name}" - Step ${nextStepNumber}`,
          description: `Action required: ${values.message_template}`,
          due_date: format(dueDate, 'yyyy-MM-dd'),
          source: 'other',
          priority: 'medium',
          user_id: user.id
        });

      if (taskError) throw taskError;

      // Map the database step type back to frontend type before returning
      return {
        ...stepData,
        step_type: mapDbStepTypeToFrontend(dbStepType, nextStepNumber)
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequence", sequenceId] });
      toast.success("Step added successfully and task created");
      setIsAddStepOpen(false);
    },
    onError: (error) => {
      console.error("Error adding step:", error);
      toast.error("Failed to add step");
    },
  });

  if (sequenceLoading) {
    return <div>Loading...</div>;
  }

  if (!sequence) {
    return <div>Sequence not found</div>;
  }

  const handleAddStep = (values: {
    step_type: StepType;
    message_template: string;
    delay_days: number;
  }) => {
    addStepMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{sequence.name}</h1>
        <p className="text-muted-foreground">{sequence.description}</p>
      </div>
      
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sequence Steps</h2>
          <Button onClick={() => setIsAddStepOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>

        <SequenceStepsList steps={sequence.sequence_steps || []} />

        <AddStepDialog
          open={isAddStepOpen}
          onOpenChange={setIsAddStepOpen}
          onSubmit={handleAddStep}
        />
      </div>
    </div>
  );
};

export default SequenceBuilder;