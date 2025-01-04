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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskSource } from "@/integrations/supabase/types/tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CreateTaskFormProps {
  source?: TaskSource;
  sourceId?: string;
  projectId?: string;
  onSuccess?: () => void;
}

export const CreateTaskForm = ({ source: initialSource, sourceId, projectId, onSuccess }: CreateTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [priority, setPriority] = useState<string>("medium");
  const [source, setSource] = useState<TaskSource>(initialSource || "other");
  const [open, setOpen] = useState(false);

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
      priority,
    });

    if (error) {
      toast.error("Failed to create task");
      return;
    }

    toast.success("Task created successfully");
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setPriority("medium");
    setOpen(false);
    onSuccess?.();
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full text-left justify-start h-auto py-3 px-4"
        onClick={() => setOpen(true)}
      >
        + Add a task...
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-lg font-medium placeholder:text-gray-400"
              />
              <Textarea
                placeholder="Add a description... (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] placeholder:text-gray-400"
              />
            </div>

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

              {!initialSource && (
                <Select value={source} onValueChange={(value) => setSource(value as TaskSource)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deals">Sales Tasks</SelectItem>
                    <SelectItem value="content">Content Tasks</SelectItem>
                    <SelectItem value="ideas">Ideas Tasks</SelectItem>
                    <SelectItem value="substack">Substack Tasks</SelectItem>
                    <SelectItem value="projects">Project Tasks</SelectItem>
                    <SelectItem value="sequences">Sequence Tasks</SelectItem>
                    <SelectItem value="other">Other Tasks</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button type="submit" className="ml-auto">
                Create Task
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};