import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { DealFormData } from "../types";

type NotesInputProps = {
  form: UseFormReturn<DealFormData>;
};

export const NotesInput = ({ form }: NotesInputProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes (Optional)</FormLabel>
          <FormControl>
            <Input placeholder="Add any relevant notes" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};