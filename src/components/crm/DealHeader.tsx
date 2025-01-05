import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateDealForm } from "./CreateDealForm";

interface DealHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DealHeader = ({ open, setOpen }: DealHeaderProps) => {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-800">
      <div className="text-left">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          CRM Pipeline
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your deals and opportunities
        </p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="bg-black hover:bg-black/90 text-white transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
          </DialogHeader>
          <CreateDealForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};