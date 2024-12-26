import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubstackForm } from "./SubstackForm";

interface CreatePostButtonProps {
  variant?: "ghost" | "default";
  size?: "icon" | "default";
}

export const CreatePostButton = ({ variant = "default", size = "default" }: CreatePostButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {size === "icon" ? (
          <Button variant={variant} size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant={variant}>
            <Plus className="w-4 h-4 mr-2" />
            New Newsletter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Newsletter</DialogTitle>
        </DialogHeader>
        <SubstackForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};