import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyFields } from "./fields/CompanyFields";
import { ContactFields } from "./fields/ContactFields";
import { SourceField } from "./fields/SourceField";
import { NotesField } from "./fields/NotesField";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_website: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_job_title: z.string().optional(),
  contact_linkedin: z.string().url().optional().or(z.literal("")),
  source: z.enum(['website', 'referral', 'linkedin', 'cold_outreach', 'conference', 'accelerator', 'other']),
  notes: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  training_event: z.string().optional(),
});

interface CreateProspectFormProps {
  onSuccess: () => void;
}

export const CreateProspectForm = ({ onSuccess }: CreateProspectFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: 'other',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to add prospects');
        return;
      }

      const { error } = await supabase
        .from('prospects')
        .insert({
          company_name: values.company_name,
          company_website: values.company_website || null,
          contact_email: values.contact_email || null,
          contact_job_title: values.contact_job_title || null,
          contact_linkedin: values.contact_linkedin || null,
          source: values.source,
          notes: values.notes || null,
          user_id: user.id,
          first_name: values.first_name,
          training_event: values.training_event || null,
          status: 'active'
        });

      if (error) throw error;

      toast.success('Prospect added successfully');
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding prospect:', error);
      toast.error('Failed to add prospect');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CompanyFields form={form} />
        <ContactFields form={form} />
        <SourceField form={form} />
        <NotesField form={form} />
        <Button type="submit" className="w-full">Add Prospect</Button>
      </form>
    </Form>
  );
};