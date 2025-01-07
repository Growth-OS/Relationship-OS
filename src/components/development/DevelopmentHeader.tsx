import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateDevelopmentItemForm } from "./CreateDevelopmentItemForm";

interface DevelopmentHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  refetch: () => void;
}

export const DevelopmentHeader = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedItem,
  setSelectedItem,
  refetch
}: DevelopmentHeaderProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-left">Development</h1>
          <p className="text-sm text-muted-foreground text-left">
            Track ideas and areas for Growth OS development
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedItem(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem ? "Edit Development Item" : "Add Development Item"}</DialogTitle>
            </DialogHeader>
            <CreateDevelopmentItemForm onSuccess={() => {
              setIsDialogOpen(false);
              setSelectedItem(null);
              refetch();
            }} itemToEdit={selectedItem} />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};