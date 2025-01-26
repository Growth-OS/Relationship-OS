import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FileIcon, Trash2 } from "lucide-react";
import heic2any from "heic2any";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface AttachmentFieldProps {
  form: UseFormReturn<any>;
  existingAttachments?: Array<{
    id: string;
    file_name: string;
    file_path: string;
  }>;
}

export const AttachmentField = ({ form, existingAttachments }: AttachmentFieldProps) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const processedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if file is HEIC
      if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith('.heic')) {
        try {
          toast.info("Converting HEIC file...");
          const blob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8
          });

          // Create a new file from the converted blob
          const convertedFile = new File(
            [Array.isArray(blob) ? blob[0] : blob], 
            file.name.replace(/\.heic$/i, '.jpg'),
            { type: 'image/jpeg' }
          );
          
          processedFiles.push(convertedFile);
          toast.success("HEIC file converted successfully");
        } catch (error) {
          console.error("Error converting HEIC file:", error);
          toast.error("Failed to convert HEIC file");
          return;
        }
      } else {
        processedFiles.push(file);
      }
    }

    form.setValue('files', processedFiles);
  };

  const handleDeleteAttachment = async (attachmentId: string, filePath: string) => {
    try {
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('financial_docs')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete the attachment record from the database
      const { error: dbError } = await supabase
        .from('transaction_attachments')
        .delete()
        .eq('id', attachmentId);

      if (dbError) throw dbError;

      toast.success("File deleted successfully");
      // Trigger a refetch of the transaction data
      window.location.reload();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <FormField
      control={form.control}
      name="files"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel>Attachments</FormLabel>
          {existingAttachments && existingAttachments.length > 0 && (
            <div className="mb-3 rounded-md border border-border bg-muted/50 p-2.5">
              {existingAttachments.map((attachment) => (
                <div 
                  key={attachment.file_path} 
                  className="flex items-center justify-between gap-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{attachment.file_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAttachment(attachment.id, attachment.file_path)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <FormControl>
            <Input
              type="file"
              accept="image/*,.pdf,.heic,.HEIC"
              onChange={handleFileChange}
              className="cursor-pointer file:cursor-pointer"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};