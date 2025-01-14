import { Switch } from "@/components/ui/switch";
import { Power } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CampaignActivationToggleProps {
  campaignId: string;
  isActive: boolean;
  onActivationChange?: () => void;
}

export const CampaignActivationToggle = ({ 
  campaignId, 
  isActive, 
  onActivationChange 
}: CampaignActivationToggleProps) => {
  const handleActivationToggle = async () => {
    try {
      const { error } = await supabase
        .from('outreach_campaigns')
        .update({ is_active: !isActive })
        .eq('id', campaignId);

      if (error) throw error;

      toast.success(isActive ? 'Campaign deactivated' : 'Campaign activated');
      if (onActivationChange) {
        onActivationChange();
      }
    } catch (error) {
      console.error('Error toggling campaign:', error);
      toast.error('Failed to update campaign status');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Power className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={isActive}
        onCheckedChange={handleActivationToggle}
        aria-label="Toggle campaign activation"
      />
    </div>
  );
};