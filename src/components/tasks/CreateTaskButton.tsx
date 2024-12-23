import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateTaskForm } from "./CreateTaskForm";

interface CreateTaskButtonProps {
  sourceId?: string;
  source?: 'crm' | 'content' | 'ideas' | 'substack' | 'other';
  onSuccess?: () => void;
  variant?: "ghost" | "default";
  size?: "icon" | "default";
}

export const CreateTaskButton = ({ 
  sourceId, 
  source = 'other', 
  onSuccess,
  variant = "default",
  size = "default"
}: CreateTaskButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {size === "icon" ? (
          <Button variant={variant} size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <CreateTaskForm 
          sourceId={sourceId} 
          source={source} 
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }} 
        />
      </DialogContent>
    </Dialog>
  );
};