import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Bug, Lightbulb, ArrowUpCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateDevelopmentItemForm } from "@/components/development/CreateDevelopmentItemForm";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const Development = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

      toast.success(completed ? "Item marked as complete" : "Item marked as pending");
      refetch();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item status");
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

  const handleSuccess = () => {
    setIsDialogOpen(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-left">Development</h1>
            <p className="text-sm text-muted-foreground text-left">
              Track ideas and areas for Growth OS development
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Development Item</DialogTitle>
              </DialogHeader>
              <CreateDevelopmentItemForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card className="p-6">
        <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="idea">
              <Lightbulb className="w-4 h-4 mr-2" />
              Ideas
            </TabsTrigger>
            <TabsTrigger value="bug">
              <Bug className="w-4 h-4 mr-2" />
              Bugs
            </TabsTrigger>
            <TabsTrigger value="feature">Features</TabsTrigger>
            <TabsTrigger value="improvement">Improvements</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredItems?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items found. Add your first development item!
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems?.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="pt-1"
                      >
                        <Checkbox
                          checked={item.status === 'completed'}
                          onCheckedChange={(checked) => {
                            handleComplete(item.id, checked as boolean);
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1 min-w-0">
                            <h3 className={cn(
                              "font-medium",
                              item.status === 'completed' && "text-muted-foreground line-through"
                            )}>
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className={cn(
                                "text-sm text-muted-foreground",
                                item.status === 'completed' && "line-through"
                              )}>
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {renderPriorityIcon(item.priority)}
                            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {item.status === 'completed' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default Development;