import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateTemplateFormData {
  title: string;
  description: string;
  file: FileList;
}

interface CreateTemplateFormProps {
  onSuccess: () => void;
}

export const CreateTemplateForm = ({ onSuccess }: CreateTemplateFormProps) => {
  const form = useForm<CreateTemplateFormData>();

  const onSubmit = async (data: CreateTemplateFormData) => {
    try {
      const file = data.file[0];
      if (!file) {
        toast.error("Please select a file");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('templates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('templates')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('project_templates')
        .insert({
          title: data.title,
          description: data.description,
          file_path: fileName,
          file_type: file.type,
        });

      if (dbError) throw dbError;

      onSuccess();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error("Failed to create template");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter template title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter template description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Template File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create Template
        </Button>
      </form>
    </Form>
  );
};