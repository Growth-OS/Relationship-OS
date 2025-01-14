import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Target, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DeleteCampaignDialog } from "./components/DeleteCampaignDialog";
import { CampaignActivationToggle } from "./components/CampaignActivationToggle";
import { useCampaignDelete } from "./hooks/useCampaignDelete";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  is_active: boolean;
}

interface CampaignCardProps {
  campaign: Campaign;
  onViewSteps: (campaignId: string) => void;
  onActivationChange?: () => void;
  onDelete?: () => void;
}

export const CampaignCard = ({ 
  campaign, 
  onViewSteps, 
  onActivationChange, 
  onDelete 
}: CampaignCardProps) => {
  const { data: leadsCount } = useQuery({
    queryKey: ['campaign-leads-count', campaign.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('lead_campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id);
      
      if (error) {
        console.error('Error fetching leads count:', error);
        return 0;
      }
      
      return count || 0;
    },
  });

  const { handleDelete } = useCampaignDelete(onDelete);

  return (
    <Card key={campaign.id}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {campaign.name}
          </div>
          <CampaignActivationToggle
            campaignId={campaign.id}
            isActive={campaign.is_active}
            onActivationChange={onActivationChange}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {campaign.description || "No description provided"}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{leadsCount} {leadsCount === 1 ? 'lead' : 'leads'}</span>
          </div>
          <div className="flex items-center gap-2">
            <DeleteCampaignDialog
              campaignName={campaign.name}
              onDelete={() => handleDelete(campaign.id, campaign.name)}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewSteps(campaign.id)}
            >
              <List className="h-4 w-4 mr-2" />
              View Steps
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};