import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "../types/lead";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddToCampaignDialogProps {
  leads: Lead[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddToCampaignDialog = ({
  leads,
  open,
  onOpenChange,
}: AddToCampaignDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingCampaignId, setProcessingCampaignId] = useState<string | null>(null);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['outreach-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_campaigns')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    }
  });

  const handleAddToCampaign = async (campaignId: string) => {
    if (isSubmitting || processingCampaignId) return;
    
    try {
      setIsSubmitting(true);
      setProcessingCampaignId(campaignId);

      // Create lead_campaigns entries for all selected leads
      const leadCampaigns = leads.map(lead => ({
        lead_id: lead.id,
        campaign_id: campaignId,
        current_step: 0,
        status: 'pending'
      }));

      const { error: insertError } = await supabase
        .from('lead_campaigns')
        .insert(leadCampaigns);

      if (insertError) throw insertError;

      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`${leads.length} leads have been added to the campaign`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding leads to campaign:', error);
      toast.error("Failed to add leads to campaign");
    } finally {
      setIsSubmitting(false);
      setProcessingCampaignId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Leads to Campaign</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : campaigns?.length === 0 ? (
            <p className="text-center text-muted-foreground">No active campaigns found</p>
          ) : (
            <div className="grid gap-2">
              {campaigns?.map((campaign) => (
                <Button
                  key={campaign.id}
                  variant="outline"
                  className="justify-start relative"
                  disabled={isSubmitting || processingCampaignId === campaign.id}
                  onClick={() => handleAddToCampaign(campaign.id)}
                >
                  {processingCampaignId === campaign.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {campaign.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};