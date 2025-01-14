import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Target, Power, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
}

export const CampaignCard = ({ campaign, onViewSteps, onActivationChange }: CampaignCardProps) => {
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

  const handleActivationToggle = async () => {
    try {
      const { error } = await supabase
        .from('outreach_campaigns')
        .update({ is_active: !campaign.is_active })
        .eq('id', campaign.id);

      if (error) throw error;

      toast.success(campaign.is_active ? 'Campaign deactivated' : 'Campaign activated');
      if (onActivationChange) {
        onActivationChange();
      }
    } catch (error) {
      console.error('Error toggling campaign:', error);
      toast.error('Failed to update campaign status');
    }
  };

  return (
    <Card key={campaign.id}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {campaign.name}
          </div>
          <div className="flex items-center gap-2">
            <Power className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={campaign.is_active}
              onCheckedChange={handleActivationToggle}
              aria-label="Toggle campaign activation"
            />
          </div>
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewSteps(campaign.id)}
          >
            <List className="h-4 w-4 mr-2" />
            View Steps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};