import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ListTodo } from "lucide-react";
import { useState } from "react";
import { CreateTaskForm } from "./CreateTaskForm";

interface CreateTaskButtonProps {
  sourceId?: string;
  source?: 'crm' | 'content' | 'ideas' | 'substack' | 'other';
  onSuccess?: () => void;
}

export const CreateTaskButton = ({ sourceId, source = 'other', onSuccess }: CreateTaskButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ListTodo className="h-4 w-4" />
        </Button>
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