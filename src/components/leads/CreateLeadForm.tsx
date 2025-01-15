import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyFields } from "./form-fields/CompanyFields";
import { ContactFields } from "./form-fields/ContactFields";
import { SourceField } from "./form-fields/SourceField";
import { NotesField } from "./form-fields/NotesField";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_website: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_job_title: z.string().optional(),
  contact_linkedin: z.string().url().optional().or(z.literal("")),
  source: z.enum(['website', 'referral', 'linkedin', 'cold_outreach', 'conference', 'accelerator', 'other']),
  notes: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateLeadFormProps {
  onSuccess: () => void;
}

const formatUrl = (url: string): string => {
  if (!url) return '';
  
  // Add https:// if no protocol is specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Remove trailing slashes
  return url.replace(/\/+$/, '');
};

export const CreateLeadForm = ({ onSuccess }: CreateLeadFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: 'other',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to add leads');
        return;
      }

      // Ensure all required fields are present in the insert
      const leadData = {
        ...values,
        user_id: user.id,
        status: 'new' as const,
        company_name: values.company_name,
      };

      const { data: newLead, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (error) throw error;

      // If website URL is provided, trigger the analysis
      if (values.company_website) {
        const formattedUrl = formatUrl(values.company_website);
        if (formattedUrl) {
          try {
            await supabase.functions.invoke('chat-with-data', {
              body: {
                action: 'analyze_company',
                leadId: newLead.id,
                websiteUrl: formattedUrl,
              },
            });
          } catch (analysisError) {
            console.error('Error analyzing website:', analysisError);
            // Don't throw here - we still want to show success for lead creation
            toast.error('Website analysis started but encountered an error');
          }
        }
      }

      toast.success('Lead added successfully');
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CompanyFields form={form} />
        <ContactFields form={form} />
        <SourceField form={form} />
        <NotesField form={form} />
        <Button type="submit" className="w-full">Add Lead</Button>
      </form>
    </Form>
  );
};