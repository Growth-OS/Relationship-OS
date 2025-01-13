import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { ChevronDown, ChevronUp, Trash2, Wand2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { cn } from "@/lib/utils";

interface SequenceStepProps {
  index: number;
  form: UseFormReturn<FormValues>;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onGenerateMessage: () => void;
  isGenerating: boolean;
}

export const SequenceStep = ({
  index,
  form,
  expanded,
  onToggle,
  onDelete,
  onGenerateMessage,
  isGenerating,
}: SequenceStepProps) => {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Step {index + 1}</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggle}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
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

      <div className={cn(
        "grid gap-4",
        expanded ? "grid-cols-2" : "grid-cols-1"
      )}>
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

      {expanded && (
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
                  onClick={onGenerateMessage}
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
      )}
    </div>
  );
};