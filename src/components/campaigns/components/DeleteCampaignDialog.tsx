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
import { useCampaignDelete } from "../hooks/useCampaignDelete";

interface DeleteCampaignDialogProps {
  campaignId: string;
  campaignName: string;
  onDelete: () => void;
  trigger: React.ReactNode;
}

export const DeleteCampaignDialog = ({ 
  campaignId,
  campaignName, 
  onDelete, 
  trigger 
}: DeleteCampaignDialogProps) => {
  const { handleDelete } = useCampaignDelete(onDelete);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the campaign "{campaignName}", remove all associated leads and tasks from it, and reset lead statuses. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleDelete(campaignId, campaignName)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};