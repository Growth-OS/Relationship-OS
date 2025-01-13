import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface SequenceDetailsProps {
  form: UseFormReturn<FormValues>;
}

export const SequenceDetails = ({ form }: SequenceDetailsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sequence Name</FormLabel>
            <Input {...field} placeholder="Enter sequence name" />
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
            <Input {...field} placeholder="Enter sequence description" />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};