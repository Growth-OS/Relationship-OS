import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Target, Power, Users, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export const CampaignCard = ({ campaign, onViewSteps, onActivationChange, onDelete }: CampaignCardProps) => {
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

  const handleDelete = async () => {
    try {
      // First, delete all campaign steps
      const { error: stepsError } = await supabase
        .from('campaign_steps')
        .delete()
        .eq('campaign_id', campaign.id);

      if (stepsError) throw stepsError;

      // Then, delete all lead campaign associations
      const { error: leadsError } = await supabase
        .from('lead_campaigns')
        .delete()
        .eq('campaign_id', campaign.id);

      if (leadsError) throw leadsError;

      // Finally, delete the campaign itself
      const { error: campaignError } = await supabase
        .from('outreach_campaigns')
        .delete()
        .eq('id', campaign.id);

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
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the campaign "{campaign.name}" and remove all associated leads from it. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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