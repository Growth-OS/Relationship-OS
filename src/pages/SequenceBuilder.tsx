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
      return data;
    },
  });

  const addStepMutation = useMutation({
    mutationFn: async (values: {
      step_type: "email" | "linkedin";
      message_template: string;
      delay_days: number;
      preferred_time?: string;
    }) => {
      const nextStepNumber = sequence?.sequence_steps?.length + 1 || 1;
      
      // First get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to create steps');
      }

      // Then create the sequence step
      const { data: stepData, error: stepError } = await supabase
        .from("sequence_steps")
        .insert({
          sequence_id: sequenceId,
          step_number: nextStepNumber,
          step_type: values.step_type,
          message_template: values.message_template,
          delay_days: values.delay_days,
          preferred_time: values.preferred_time,
        })
        .select()
        .single();

      if (stepError) throw stepError;

      // Then create a task for this step
      const dueDate = addDays(new Date(), values.delay_days);
      const { error: taskError } = await supabase
        .from("tasks")
        .insert({
          title: `${values.step_type === 'email' ? 'Send email' : 'Send LinkedIn message'} for sequence "${sequence?.name}" - Step ${nextStepNumber}`,
          description: `Action required: ${values.message_template}\n\nPreferred time: ${values.preferred_time || 'Any time'}`,
          due_date: format(dueDate, 'yyyy-MM-dd'),
          source: 'other',
          priority: 'medium',
          user_id: user.id
        });

      if (taskError) throw taskError;

      return stepData;
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
    step_type: "email" | "linkedin";
    message_template: string;
    delay_days: number;
    preferred_time?: string;
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