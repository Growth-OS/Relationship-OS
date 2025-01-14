import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCampaignDelete = (onDelete?: () => void) => {
  const handleDelete = async (campaignId: string, campaignName: string) => {
    try {
      // First, get all leads associated with this campaign
      const { data: leadCampaigns, error: leadsError } = await supabase
        .from('lead_campaigns')
        .select('lead_id')
        .eq('campaign_id', campaignId);

      if (leadsError) throw leadsError;

      const leadIds = leadCampaigns?.map(lc => lc.lead_id) || [];

      // First delete lead campaign associations
      const { error: leadCampaignsError } = await supabase
        .from('lead_campaigns')
        .delete()
        .eq('campaign_id', campaignId);

      if (leadCampaignsError) throw leadCampaignsError;

      // Then delete tasks associated with these leads
      if (leadIds.length > 0) {
        const { error: tasksError } = await supabase
          .from('tasks')
          .delete()
          .eq('source', 'other')
          .in('source_id', leadIds);

        if (tasksError) throw tasksError;
      }

      // Delete all campaign steps
      const { error: stepsError } = await supabase
        .from('campaign_steps')
        .delete()
        .eq('campaign_id', campaignId);

      if (stepsError) throw stepsError;

      // Update leads status back to "new"
      if (leadIds.length > 0) {
        const { error: updateLeadsError } = await supabase
          .from('leads')
          .update({ status: 'new' })
          .in('id', leadIds);

        if (updateLeadsError) throw updateLeadsError;
      }

      // Finally, delete the campaign itself
      const { error: campaignError } = await supabase
        .from('outreach_campaigns')
        .delete()
        .eq('id', campaignId);

      if (campaignError) throw campaignError;

      toast.success('Campaign deleted successfully');
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  return { handleDelete };
};