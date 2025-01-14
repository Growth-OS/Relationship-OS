import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Target } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  onViewSteps: (campaignId: string) => void;
}

export const CampaignCard = ({ campaign, onViewSteps }: CampaignCardProps) => {
  return (
    <Card key={campaign.id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {campaign.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {campaign.description || "No description provided"}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm">
            {new Date(campaign.created_at).toLocaleDateString()}
          </span>
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