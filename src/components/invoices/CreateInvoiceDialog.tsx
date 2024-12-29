import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateInvoiceForm } from "./CreateInvoiceForm";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateInvoiceDialog = ({ open, onOpenChange }: CreateInvoiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <CreateInvoiceForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};