import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditProspectForm } from "../EditProspectForm";
import type { Prospect } from "../types/prospect";

interface EditProspectDialogProps {
  prospect: Prospect;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditProspectDialog = ({ 
  prospect, 
  open, 
  onOpenChange,
  onSuccess 
}: EditProspectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle>Edit Prospect</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <EditProspectForm 
            prospect={prospect} 
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};