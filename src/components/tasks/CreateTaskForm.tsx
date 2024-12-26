import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateTaskFormProps {
  source: "other" | "deals" | "content" | "ideas" | "substack" | "projects";
  projectId?: string;
}

export const CreateTaskForm = ({ source, projectId }: CreateTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("tasks").insert({
      title,
      description,
      source,
      project_id: projectId,
    });

    if (error) {
      toast.error("Failed to create task");
      return;
    }

    toast.success("Task created successfully");
    setTitle("");
    setDescription("");
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
      <Button type="submit">Create Task</Button>
    </form>
  );
};