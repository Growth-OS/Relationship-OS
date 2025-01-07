import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, Lightbulb } from "lucide-react";
import { DevelopmentList } from "./DevelopmentList";

interface DevelopmentTabsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isLoading: boolean;
  filteredItems: any[];
  handleComplete: (id: string, completed: boolean) => Promise<void>;
  handleEdit: (item: any) => void;
  renderPriorityIcon: (priority: string) => JSX.Element | null;
}

export const DevelopmentTabs = ({
  selectedCategory,
  setSelectedCategory,
  isLoading,
  filteredItems,
  handleComplete,
  handleEdit,
  renderPriorityIcon
}: DevelopmentTabsProps) => {
  return (
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
            <DevelopmentList
              filteredItems={filteredItems}
              handleComplete={handleComplete}
              handleEdit={handleEdit}
              renderPriorityIcon={renderPriorityIcon}
            />
          )}
        </div>
      </Tabs>
    </Card>
  );
};