import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface CreateTaskFormProps {
  source: "other" | "deals" | "content" | "ideas" | "substack" | "projects";
  sourceId?: string;
  projectId?: string;
  onSuccess?: () => void;
}

export const CreateTaskForm = ({ source, sourceId, projectId, onSuccess }: CreateTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
    });

    if (error) {
      toast.error("Failed to create task");
      return;
    }

    toast.success("Task created successfully");
    setTitle("");
    setDescription("");
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
      <Button type="submit">Create Task</Button>
    </form>
  );
};