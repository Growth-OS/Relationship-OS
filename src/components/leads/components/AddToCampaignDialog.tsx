import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "../types/lead";
import { toast } from "sonner";

interface AddToCampaignDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddToCampaignDialog = ({
  lead,
  open,
  onOpenChange,
}: AddToCampaignDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('lead_campaigns')
        .insert({
          lead_id: lead.id,
          campaign_id: campaignId,
          current_step: 0,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(`${lead.company_name} has been added to the campaign`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding lead to campaign:', error);
      toast.error("Failed to add lead to campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Lead to Campaign</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <p>Loading campaigns...</p>
          ) : campaigns?.length === 0 ? (
            <p>No active campaigns found</p>
          ) : (
            <div className="grid gap-2">
              {campaigns?.map((campaign) => (
                <Button
                  key={campaign.id}
                  variant="outline"
                  className="justify-start"
                  disabled={isSubmitting}
                  onClick={() => handleAddToCampaign(campaign.id)}
                >
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