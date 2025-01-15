import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { cn } from "@/lib/utils";

interface SequenceStepProps {
  index: number;
  form: UseFormReturn<FormValues>;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const SequenceStep = ({
  index,
  form,
  expanded,
  onToggle,
  onDelete,
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
                  <SelectItem value="email">Email 1</SelectItem>
                  <SelectItem value="email_2">Email 2</SelectItem>
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
                <Input 
                  type="number" 
                  min="0" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};