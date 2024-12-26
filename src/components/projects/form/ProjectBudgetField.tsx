import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "./types";

interface ProjectBudgetFieldProps {
  form: UseFormReturn<ProjectFormData>;
}

export const ProjectBudgetField = ({ form }: ProjectBudgetFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="budget"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Budget</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              {...field} 
              onChange={e => field.onChange(e.target.valueAsNumber)}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};