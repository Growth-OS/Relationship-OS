import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateSequenceForm } from "./CreateSequenceForm";
import { ExistingSequencesList } from "./ExistingSequencesList";

interface AssignSequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProspects: string[];
}

export const AssignSequenceDialog = ({
  open,
  onOpenChange,
  selectedProspects,
}: AssignSequenceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Assign Prospects to Sequence</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="existing">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Sequences</TabsTrigger>
            <TabsTrigger value="create">Create New Sequence</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <ExistingSequencesList
              selectedProspects={selectedProspects}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
          <TabsContent value="create">
            <CreateSequenceForm
              selectedProspects={selectedProspects}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};