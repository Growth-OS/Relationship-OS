import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PlusCircle, Save } from "lucide-react";
import { useState } from "react";

interface ContentStrategy {
  id: string;
  title: string;
  description: string | null;
  target_audience: string | null;
  key_topics: string[];
  content_pillars: string[];
  publishing_frequency: string | null;
}

export const ContentStrategySection = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [strategy, setStrategy] = useState<Partial<ContentStrategy>>({
    title: "",
    description: "",
    target_audience: "",
    key_topics: [],
    content_pillars: [],
    publishing_frequency: "",
  });

  const { data: existingStrategy, isLoading } = useQuery({
    queryKey: ["contentStrategy"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_strategy")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as ContentStrategy;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newStrategy: Partial<ContentStrategy>) => {
      if (existingStrategy?.id) {
        const { error } = await supabase
          .from("content_strategy")
          .update(newStrategy)
          .eq("id", existingStrategy.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("content_strategy")
          .insert([newStrategy]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentStrategy"] });
      toast.success("Content strategy saved successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error saving content strategy:", error);
      toast.error("Failed to save content strategy");
    },
  });

  const handleSave = () => {
    mutation.mutate(strategy);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setStrategy(existingStrategy || {
      title: "",
      description: "",
      target_audience: "",
      key_topics: [],
      content_pillars: [],
      publishing_frequency: "",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Content Strategy</CardTitle>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline">
            {existingStrategy ? "Edit Strategy" : "Create Strategy"}
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={mutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Strategy
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {!isEditing && existingStrategy ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Title</h3>
              <p>{existingStrategy.title}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p>{existingStrategy.description}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Target Audience</h3>
              <p>{existingStrategy.target_audience}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {existingStrategy.key_topics?.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">Content Pillars</h3>
              <div className="flex flex-wrap gap-2">
                {existingStrategy.content_pillars?.map((pillar, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {pillar}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">Publishing Frequency</h3>
              <p>{existingStrategy.publishing_frequency}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="font-medium mb-1 block">Title</label>
              <Input
                value={strategy.title || ""}
                onChange={(e) =>
                  setStrategy((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter strategy title"
              />
            </div>
            <div>
              <label className="font-medium mb-1 block">Description</label>
              <Textarea
                value={strategy.description || ""}
                onChange={(e) =>
                  setStrategy((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe your content strategy"
              />
            </div>
            <div>
              <label className="font-medium mb-1 block">Target Audience</label>
              <Textarea
                value={strategy.target_audience || ""}
                onChange={(e) =>
                  setStrategy((prev) => ({
                    ...prev,
                    target_audience: e.target.value,
                  }))
                }
                placeholder="Describe your target audience"
              />
            </div>
            <div>
              <label className="font-medium mb-1 block">Key Topics</label>
              <Input
                value={strategy.key_topics?.join(", ") || ""}
                onChange={(e) =>
                  setStrategy((prev) => ({
                    ...prev,
                    key_topics: e.target.value.split(",").map((t) => t.trim()),
                  }))
                }
                placeholder="Enter topics separated by commas"
              />
            </div>
            <div>
              <label className="font-medium mb-1 block">Content Pillars</label>
              <Input
                value={strategy.content_pillars?.join(", ") || ""}
                onChange={(e) =>
                  setStrategy((prev) => ({
                    ...prev,
                    content_pillars: e.target.value.split(",").map((t) => t.trim()),
                  }))
                }
                placeholder="Enter content pillars separated by commas"
              />
            </div>
            <div>
              <label className="font-medium mb-1 block">Publishing Frequency</label>
              <Input
                value={strategy.publishing_frequency || ""}
                onChange={(e) =>
                  setStrategy((prev) => ({
                    ...prev,
                    publishing_frequency: e.target.value,
                  }))
                }
                placeholder="e.g., Weekly, Bi-weekly, Monthly"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};