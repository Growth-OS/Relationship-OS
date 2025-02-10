import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { CreateCampaignDialog } from "@/components/prospects/components/sequence-form/CreateCampaignDialog";
import { CampaignCard } from "./CampaignCard";
import { CampaignStepsDialog } from "./CampaignStepsDialog";
import { useState } from "react";
import { CampaignStep } from "@/components/prospects/components/sequence-form/types/campaignStep";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  is_active: boolean;
}

export const CampaignsList = () => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [viewStepsOpen, setViewStepsOpen] = useState(false);

  const { data: campaigns, isLoading: campaignsLoading, refetch } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Error fetching campaigns");
        throw error;
      }
      
      return data as Campaign[];
    },
  });

  const { data: campaignSteps, isLoading: stepsLoading } = useQuery({
    queryKey: ['campaign_steps', selectedCampaignId],
    enabled: !!selectedCampaignId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_steps')
        .select('*')
        .eq('campaign_id', selectedCampaignId)
        .order('sequence_order', { ascending: true });
      
      if (error) {
        toast.error("Error fetching campaign steps");
        throw error;
      }
      
      return data as CampaignStep[];
    },
  });

  const handleViewSteps = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setViewStepsOpen(true);
  };

  const handleCampaignDeleted = async () => {
    await refetch();
  };

  if (campaignsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateCampaignDialog onSuccess={refetch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns?.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onViewSteps={handleViewSteps}
            onActivationChange={refetch}
            onDelete={handleCampaignDeleted}
          />
        ))}
      </div>

      <CampaignStepsDialog
        open={viewStepsOpen}
        onOpenChange={setViewStepsOpen}
        steps={campaignSteps}
        isLoading={stepsLoading}
      />

      {campaigns?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">No campaigns yet</p>
            <p className="text-muted-foreground mb-4">
              Create your first outreach campaign to get started
            </p>
            <CreateCampaignDialog onSuccess={refetch} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};