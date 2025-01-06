import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";
import { DevelopmentHeader } from "@/components/development/DevelopmentHeader";
import { DevelopmentTabs } from "@/components/development/DevelopmentTabs";

const Development = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ["development-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("development_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch development items");
        throw error;
      }

      return data;
    },
  });

  const handleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("development_items")
        .update({ status: completed ? "completed" : "pending" })
        .eq("id", id);

      if (error) throw error;

      toast.success(completed ? "Item moved to archived" : "Item marked as pending");
      refetch();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item status");
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const renderPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <ArrowUpCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <ArrowUpCircle className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <ArrowUpCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredItems = items?.filter(
    (item) => {
      if (selectedCategory === "archived") {
        return item.status === "completed";
      }
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesCategory && item.status === "pending";
    }
  );

  return (
    <div className="space-y-6">
      <DevelopmentHeader
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        refetch={refetch}
      />

      <DevelopmentTabs
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isLoading={isLoading}
        filteredItems={filteredItems}
        handleComplete={handleComplete}
        handleEdit={handleEdit}
        renderPriorityIcon={renderPriorityIcon}
      />
    </div>
  );
};

export default Development;