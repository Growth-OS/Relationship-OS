import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateCampaignForm } from "./CreateCampaignForm";
import { useToast } from "@/components/ui/use-toast";

export const CreateCampaignDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSuccess = () => {
    setOpen(false);
    toast({
      title: "Campaign created",
      description: "Your outreach campaign has been created successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <CreateCampaignForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};