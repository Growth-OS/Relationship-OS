import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface StepFormValues {
  step_type: "email" | "linkedin_message";
  message_template: string;
  delay_days: number;
  preferred_time?: string;
}

const SequenceBuilder = () => {
  const { sequenceId } = useParams();
  const queryClient = useQueryClient();

  const form = useForm<StepFormValues>({
    defaultValues: {
      step_type: "email",
      message_template: "",
      delay_days: 1,
    },
  });

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
    mutationFn: async (values: StepFormValues) => {
      const nextStepNumber = sequence?.sequence_steps?.length + 1 || 1;
      
      const { data, error } = await supabase
        .from("sequence_steps")
        .insert([{
          sequence_id: sequenceId,
          step_number: nextStepNumber,
          step_type: values.step_type,
          message_template: values.message_template,
          delay_days: values.delay_days,
          preferred_time: values.preferred_time,
        }]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequence", sequenceId] });
      toast.success("Step added successfully");
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

  const onSubmit = (values: StepFormValues) => {
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Sequence Step</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="step_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select step type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="linkedin_message">LinkedIn Message</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message_template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message Template</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message template..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="delay_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delay (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferred_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Add Step</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {sequence.sequence_steps?.length === 0 ? (
          <p className="text-muted-foreground">No steps added yet. Start building your sequence by adding steps.</p>
        ) : (
          <div className="space-y-4">
            {sequence.sequence_steps?.map((step: any) => (
              <div key={step.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Step {step.step_number}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{step.step_type.replace('_', ' ')}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {step.delay_days} day{step.delay_days !== 1 ? 's' : ''} delay
                    {step.preferred_time && ` at ${step.preferred_time}`}
                  </div>
                </div>
                <div className="mt-2 text-sm whitespace-pre-wrap">{step.message_template}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SequenceBuilder;