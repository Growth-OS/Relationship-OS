import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface AttachmentFieldProps {
  form: UseFormReturn<any>;
}

export const AttachmentField = ({ form }: AttachmentFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="files"
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>Attachments (Optional)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onChange(e.target.files)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};