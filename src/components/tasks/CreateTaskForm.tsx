import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateTaskFormProps {
  source: "other" | "deals" | "content" | "ideas" | "substack" | "projects";
  sourceId?: string;
  projectId?: string;
  onSuccess?: () => void;
}

export const CreateTaskForm = ({ source, sourceId, projectId, onSuccess }: CreateTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create tasks");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      title,
      description,
      source,
      source_id: sourceId,
      project_id: projectId,
      user_id: user.id,
      due_date: dueDate?.toISOString().split('T')[0],
    });

    if (error) {
      toast.error("Failed to create task");
      return;
    }

    toast.success("Task created successfully");
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Popover>
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
            onSelect={setDueDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button type="submit">Create Task</Button>
    </form>
  );
};