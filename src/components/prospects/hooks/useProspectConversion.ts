import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Prospect } from "../types/prospect";
import { useQueryClient } from "@tanstack/react-query";

export const useProspectConversion = () => {
  const queryClient = useQueryClient();

  const handleConvertToLead = async (prospect: Prospect) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to convert prospects');
        return;
      }

      console.log('Converting prospect to deal:', prospect);

      // Create new deal
      const { data: dealData, error: dealError } = await supabase
        .from('deals')
        .insert({
          user_id: user.id,
          company_name: prospect.company_name,
          contact_email: prospect.contact_email,
          contact_linkedin: prospect.contact_linkedin,
          contact_job_title: prospect.contact_job_title,
          stage: 'lead',
          source: prospect.source,
          notes: prospect.notes,
          company_website: prospect.company_website,
          deal_value: 0, // Default value
          last_activity_date: new Date().toISOString()
        })
        .select()
        .single();

      if (dealError) {
        console.error('Error creating deal:', dealError);
        throw dealError;
      }

      // Update prospect status
      const { error: prospectError } = await supabase
        .from('prospects')
        .update({ 
          status: 'converted',
          is_converted_to_deal: true 
        })
        .eq('id', prospect.id);

      if (prospectError) {
        console.error('Error updating prospect status:', prospectError);
        throw prospectError;
      }

      // Invalidate both prospects and deals queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      toast.success('Prospect converted to deal successfully');
    } catch (error) {
      console.error('Error in conversion:', error);
      toast.error('Failed to convert prospect to deal');
    }
  };

  return { handleConvertToLead };
};