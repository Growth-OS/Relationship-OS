import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewSequenceDialogProps {
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

export const ViewSequenceDialog = ({
  open,
  onOpenChange,
  sequence,
}: ViewSequenceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Sequence: {sequence.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{sequence.description || "No description provided"}</p>
          </div>
          <div>
            <h3 className="font-medium">Steps</h3>
            <div className="space-y-2">
              {sequence.sequence_steps.map((step, index) => (
                <div key={step.id} className="text-sm">
                  Step {index + 1}: {step.step_type}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium">Assigned Prospects</h3>
            <p className="text-sm text-muted-foreground">
              {sequence.sequence_assignments.length} prospects assigned
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};