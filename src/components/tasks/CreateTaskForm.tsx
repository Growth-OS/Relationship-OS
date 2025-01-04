import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskSource } from "@/integrations/supabase/types/tasks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface CreateTaskFormProps {
  onSuccess?: () => void;
  source?: TaskSource;
  sourceId?: string;
  projectId?: string;
}

export const CreateTaskForm = ({ onSuccess, source = "other", sourceId, projectId }: CreateTaskFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [priority, setPriority] = useState<string>("medium");
  const [selectedSource, setSelectedSource] = useState<TaskSource>(source);

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

    if (!title) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      const { error } = await supabase.from("tasks").insert({
        title,
        description,
        source: source || selectedSource,
        source_id: sourceId,
        project_id: projectId,
        user_id: user.id,
        due_date: dueDate?.toISOString().split('T')[0],
        priority,
      });

      if (error) {
        console.error("Error creating task:", error);
        toast.error("Failed to create task");
        return;
      }

      toast.success("Task created successfully");
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setPriority("medium");
      setIsExpanded(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  if (!isExpanded) {
    return (
      <Button 
        variant="outline" 
        className="w-full text-left justify-start h-auto py-3 px-4"
        onClick={() => setIsExpanded(true)}
      >
        + Add a task...
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-background">
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      <Select 
        value={source || selectedSource} 
        onValueChange={(value: TaskSource) => setSelectedSource(value)}
        disabled={!!source}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="projects">Projects</SelectItem>
          <SelectItem value="deals">Deals</SelectItem>
          <SelectItem value="content">Content</SelectItem>
          <SelectItem value="ideas">Ideas</SelectItem>
          <SelectItem value="substack">Substack</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Textarea
        placeholder="Add a description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Set due date"}
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

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Set priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => setIsExpanded(false)} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create Task
        </Button>
      </div>
    </form>
  );
};