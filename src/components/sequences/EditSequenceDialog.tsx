import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditSequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sequence: {
    id: string;
    name: string;
    description?: string;
    status: string;
    sequence_steps: Array<any>;
    sequence_assignments: Array<any>;
  };
}

export const EditSequenceDialog = ({
  open,
  onOpenChange,
  sequence,
}: EditSequenceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Sequence: {sequence.name}</DialogTitle>
        </DialogHeader>
        {/* Form will be added in a future update */}
      </DialogContent>
    </Dialog>
  );
};