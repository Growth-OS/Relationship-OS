import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Editor } from "@/components/editor/Editor";
import { Trash2, Wand2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SequenceFormValues } from "./types";
import { useMessageGeneration } from "@/components/prospects/hooks/useMessageGeneration";

interface SequenceStepProps {
  index: number;
  form: UseFormReturn<SequenceFormValues>;
  onDelete: () => void;
}

export const SequenceStep = ({
  index,
  form,
  onDelete,
}: SequenceStepProps) => {
  const { generateMessage, isGenerating } = useMessageGeneration();

  const handleGenerateMessage = async () => {
    const stepType = form.getValues(`steps.${index}.step_type`);
    const generatedMessage = await generateMessage({
      template: "",
      prospectData: {
        "First Name": "John",
        "Company Name": "Example Corp",
        "Website": "example.com",
      },
      stepType,
    });

    if (generatedMessage) {
      form.setValue(`steps.${index}.message_template`, generatedMessage);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Step {index + 1}</h4>
        {index > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
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
                onClick={handleGenerateMessage}
                disabled={isGenerating}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Message
              </Button>
            </div>
            <FormControl>
              <Editor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Enter message template..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};