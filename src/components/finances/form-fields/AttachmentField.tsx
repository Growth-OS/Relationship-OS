import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FileIcon } from "lucide-react";

interface AttachmentFieldProps {
  form: UseFormReturn<any>;
  existingAttachments?: Array<{
    file_name: string;
    file_path: string;
  }>;
}

export const AttachmentField = ({ form, existingAttachments }: AttachmentFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="files"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel>Attachments</FormLabel>
          {existingAttachments && existingAttachments.length > 0 && (
            <div className="mb-2 space-y-1">
              {existingAttachments.map((attachment) => (
                <div key={attachment.file_path} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileIcon className="h-4 w-4" />
                  <span>{attachment.file_name}</span>
                </div>
              ))}
            </div>
          )}
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