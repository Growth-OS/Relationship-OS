import { Switch } from "@/components/ui/switch";
import { Power } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface CampaignActivationToggleProps {
  campaignId: string;
  isActive: boolean;
  onActivationChange: () => void;
}

export const CampaignActivationToggle = ({ 
  campaignId, 
  isActive, 
  onActivationChange 
}: CampaignActivationToggleProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleActivationToggle = async () => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('outreach_campaigns')
        .update({ is_active: !isActive })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;

      toast.success(isActive ? 'Campaign deactivated' : 'Campaign activated');
      onActivationChange();
    } catch (error) {
      console.error('Error toggling campaign:', error);
      toast.error('Failed to update campaign status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Power className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={isActive}
        onCheckedChange={handleActivationToggle}
        disabled={isUpdating}
        aria-label="Toggle campaign activation"
      />
    </div>
  );
};