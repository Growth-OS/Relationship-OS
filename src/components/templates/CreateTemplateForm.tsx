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
  google_docs_url: string;
}

interface CreateTemplateFormProps {
  onSuccess: () => void;
  initialData?: CreateTemplateFormData & { id: string } | null;
}

export const CreateTemplateForm = ({ onSuccess, initialData }: CreateTemplateFormProps) => {
  const form = useForm<CreateTemplateFormData>({
    defaultValues: initialData || {
      title: '',
      description: '',
      google_docs_url: '',
    },
  });

  const onSubmit = async (data: CreateTemplateFormData) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error("You must be logged in to create templates");
        return;
      }

      if (initialData?.id) {
        // Update existing template
        const { error: dbError } = await supabase
          .from('project_templates')
          .update({
            title: data.title,
            description: data.description,
            google_docs_url: data.google_docs_url,
          })
          .eq('id', initialData.id);

        if (dbError) throw dbError;
      } else {
        // Create new template
        const { error: dbError } = await supabase
          .from('project_templates')
          .insert({
            title: data.title,
            description: data.description,
            google_docs_url: data.google_docs_url,
            user_id: session.user.id
          });

        if (dbError) throw dbError;
      }

      toast.success(initialData ? "Template updated successfully" : "Template created successfully");
      onSuccess();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Failed to save template");
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
          name="google_docs_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Docs URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter Google Docs URL" 
                  type="url"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {initialData ? 'Update Template' : 'Create Template'}
        </Button>
      </form>
    </Form>
  );
};