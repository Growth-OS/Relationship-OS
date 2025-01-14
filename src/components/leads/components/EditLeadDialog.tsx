import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditLeadForm } from "./EditLeadForm";
import type { Lead } from "../types/lead";

interface EditLeadDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditLeadDialog = ({ 
  lead, 
  open, 
  onOpenChange,
  onSuccess 
}: EditLeadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>
        <EditLeadForm 
          lead={lead} 
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};