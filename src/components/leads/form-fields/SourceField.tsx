import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface SourceFieldProps {
  form: UseFormReturn<any>;
}

export const SourceField = ({ form }: SourceFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="source"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Source</FormLabel>
          <FormControl>
            <Input placeholder="Enter lead source" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};