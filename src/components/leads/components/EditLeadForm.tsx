import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyFields } from "../form-fields/CompanyFields";
import { ContactFields } from "../form-fields/ContactFields";
import { SourceField } from "../form-fields/SourceField";
import { NotesField } from "../form-fields/NotesField";
import type { Lead } from "../types/lead";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_website: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_job_title: z.string().optional(),
  contact_linkedin: z.string().url().optional().or(z.literal("")),
  source: z.string().min(1, "Source is required"),
  notes: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
});

interface EditLeadFormProps {
  lead: Lead;
  onSuccess: () => void;
}

export const EditLeadForm = ({ lead, onSuccess }: EditLeadFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: lead.company_name,
      company_website: lead.company_website || "",
      contact_email: lead.contact_email || "",
      contact_job_title: lead.contact_job_title || "",
      contact_linkedin: lead.contact_linkedin || "",
      source: lead.source || "",
      notes: lead.notes || "",
      first_name: lead.first_name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(values)
        .eq('id', lead.id);

      if (error) throw error;

      toast.success('Lead updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CompanyFields form={form} />
        <ContactFields form={form} />
        <SourceField form={form} />
        <NotesField form={form} />
        <Button type="submit" className="w-full">Update Lead</Button>
      </form>
    </Form>
  );
};