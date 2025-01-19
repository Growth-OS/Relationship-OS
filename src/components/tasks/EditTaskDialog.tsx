import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO, startOfDay } from "date-fns";
import { CalendarIcon, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface EditTaskDialogProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
  };
  onUpdate?: () => void;
}

export const EditTaskDialog = ({ task, onUpdate }: EditTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? startOfDay(parseISO(task.due_date)) : undefined
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedDate = dueDate ? format(startOfDay(dueDate), 'yyyy-MM-dd') : null;
    
    const { error } = await supabase
      .from("tasks")
      .update({
        title,
        description: description || null,
        due_date: formattedDate,
      })
      .eq("id", task.id);

    if (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
      return;
    }

    toast.success("Task updated successfully");
    setOpen(false);
    
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
    
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="relative">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) =>
                    date < new Date("1900-01-01") ||
                    date > new Date("2100-01-01")
                  }
                  className="rounded-md border shadow-md"
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full">
            Update Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};