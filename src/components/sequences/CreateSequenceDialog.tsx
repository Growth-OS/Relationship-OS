import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateSequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSequenceDialog = ({
  open,
  onOpenChange,
}: CreateSequenceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Sequence</DialogTitle>
        </DialogHeader>
        {/* Form will be added in a future update */}
      </DialogContent>
    </Dialog>
  );
};