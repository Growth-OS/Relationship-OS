import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Prospect } from "../types/prospect";

export const useProspectConversion = () => {
  const handleConvertToLead = async (prospect: Prospect) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to convert prospects');
        return;
      }

      console.log('Converting prospect to lead:', prospect);

      const { error } = await supabase
        .from('deals')
        .insert({
          user_id: user.id,
          company_name: prospect.company_name,
          contact_email: prospect.contact_email,
          contact_linkedin: prospect.contact_linkedin,
          contact_job_title: prospect.contact_job_title,
          stage: 'lead',
          source: prospect.source,
          notes: prospect.notes
        });

      if (error) {
        console.error('Error converting prospect to lead:', error);
        throw error;
      }

      // Update prospect status
      const { error: updateError } = await supabase
        .from('prospects')
        .update({ status: 'converted' })
        .eq('id', prospect.id);

      if (updateError) {
        console.error('Error updating prospect status:', updateError);
        throw updateError;
      }

      toast.success('Prospect converted to lead successfully');
    } catch (error) {
      console.error('Error in conversion:', error);
      toast.error('Failed to convert prospect to lead');
    }
  };

  return { handleConvertToLead };
};