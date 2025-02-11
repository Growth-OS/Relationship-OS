import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateTaskForm } from "./CreateTaskForm";
import { TaskSource } from "@/integrations/supabase/types/tasks";
import { ReactNode } from "react";

interface CreateTaskButtonProps {
  sourceId?: string;
  source?: TaskSource;
  onSuccess?: () => void;
  variant?: "ghost" | "default";
  size?: "icon" | "default";
  className?: string;
  children?: ReactNode;
}

export const CreateTaskButton = ({ 
  sourceId, 
  source, 
  onSuccess,
  variant = "default",
  size = "default",
  className,
  children
}: CreateTaskButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          <Button variant={variant} className={className}>
            {children}
          </Button>
        ) : size === "icon" ? (
          <Button variant={variant} size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            className={`bg-white text-primary hover:bg-gray-100 ${className}`}
          >
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
          source={source}
          sourceId={sourceId}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};