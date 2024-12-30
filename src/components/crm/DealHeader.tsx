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
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#33C3F0] to-[#1EAEDB] bg-clip-text text-transparent">
          CRM Pipeline
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your deals and opportunities
        </p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#1EAEDB] hover:bg-[#0FA0CE] transition-colors">
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