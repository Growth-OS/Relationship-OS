import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useState } from "react";
import { StrategyForm } from "./components/StrategyForm";
import { StrategyDisplay } from "./components/StrategyDisplay";

interface ContentStrategy {
  id: string;
  title: string;
  description: string | null;
  target_audience: string | null;
  key_topics: string[];
  content_pillars: string[];
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      if (existingStrategy?.id) {
        const { error } = await supabase
          .from("content_strategy")
          .update(newStrategy)
          .eq("id", existingStrategy.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("content_strategy")
          .insert([{ ...newStrategy, user_id: user.id }]);
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
    });
  };

  const handleChange = (field: string, value: any) => {
    setStrategy((prev) => ({ ...prev, [field]: value }));
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
      <CardContent>
        {!isEditing && existingStrategy ? (
          <StrategyDisplay strategy={existingStrategy} />
        ) : (
          <StrategyForm strategy={strategy} onChange={handleChange} />
        )}
      </CardContent>
    </Card>
  );
};