import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Trash2, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { useState } from "react";
import { MessagePreviewModal } from "./MessagePreviewModal";
import { useMessageGeneration } from "../hooks/useMessageGeneration";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  steps: z.array(z.object({
    step_type: z.enum(["email", "linkedin_connection", "linkedin_message"]),
    delay_days: z.coerce.number().min(0),
    message_template: z.string().optional(),
  })).min(1, "At least one step is required"),
});

type FormValues = z.infer<typeof formSchema>;

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
    
    // Example prospect data for preview
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

      // Create the sequence
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

      // Create sequence steps
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

      // Assign prospects to the sequence
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sequence Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter sequence name" {...field} />
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter sequence description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Step {index + 1}</h4>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentSteps = form.getValues("steps");
                      form.setValue(
                        "steps",
                        currentSteps.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`steps.${index}.step_type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select step type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="linkedin_connection">LinkedIn Connection</SelectItem>
                          <SelectItem value="linkedin_message">LinkedIn Message</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`steps.${index}.delay_days`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delay (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`steps.${index}.message_template`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Message Template</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateMessage(index)}
                        disabled={isGenerating}
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Message
                      </Button>
                    </div>
                    <FormControl>
                      <RichTextEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
