import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyFields } from "./form-fields/CompanyFields";
import { ContactFields } from "./form-fields/ContactFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_website: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_job_title: z.string().optional(),
  contact_linkedin: z.string().url().optional().or(z.literal("")),
  source: z.enum(['website', 'referral', 'linkedin', 'cold_outreach', 'conference', 'other']),
  notes: z.string().optional(),
});

interface CreateProspectFormProps {
  onSuccess: () => void;
}

export const CreateProspectForm = ({ onSuccess }: CreateProspectFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      company_website: "",
      contact_email: "",
      contact_job_title: "",
      contact_linkedin: "",
      source: 'other',
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to add prospects');
        return;
      }

      // Add detailed logging
      console.log('Form values before submission:', values);
      console.log('Company website value:', values.company_website);

      const prospectData = {
        company_name: values.company_name,
        company_website: values.company_website || null,
        contact_email: values.contact_email || null,
        contact_job_title: values.contact_job_title || null,
        contact_linkedin: values.contact_linkedin || null,
        source: values.source,
        notes: values.notes || null,
        user_id: user.id,
        status: 'active'
      };

      console.log('Data being sent to Supabase:', prospectData);

      const { error, data } = await supabase
        .from('prospects')
        .insert(prospectData)
        .select();

      if (error) {
        console.error('Error adding prospect:', error);
        throw error;
      }

      console.log('Supabase response:', data);

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
        
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Source</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <ContactFields form={form} />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Add Prospect</Button>
      </form>
    </Form>
  );
};