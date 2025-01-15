import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { CampaignActivationToggle } from "./components/CampaignActivationToggle";
import { DeleteCampaignDialog } from "./components/DeleteCampaignDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onActivationChange: () => void;
  onDelete: () => void;
}

export const CampaignCard = ({
  campaign,
  onViewSteps,
  onActivationChange,
  onDelete,
}: CampaignCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{campaign.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewSteps(campaign.id)}>
              View Steps
            </DropdownMenuItem>
            <DeleteCampaignDialog
              campaignId={campaign.id}
              onDelete={onDelete}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Campaign
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent 
        className="pt-2" 
        onClick={() => onViewSteps(campaign.id)}
      >
        {campaign.description && (
          <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Created: {new Date(campaign.created_at).toLocaleDateString()}
          </span>
          <span className={`text-sm ${campaign.is_active ? 'text-green-600' : 'text-gray-500'}`}>
            {campaign.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <CampaignActivationToggle
          campaignId={campaign.id}
          isActive={campaign.is_active}
          onSuccess={onActivationChange}
        />
      </CardFooter>
    </Card>
  );
};