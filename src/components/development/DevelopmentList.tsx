import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, CheckCircle2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface DevelopmentListProps {
  filteredItems: any[];
  handleComplete: (id: string, completed: boolean) => Promise<void>;
  handleEdit: (item: any) => void;
  renderPriorityIcon: (priority: string) => JSX.Element | null;
}

export const DevelopmentList = ({
  filteredItems,
  handleComplete,
  handleEdit,
  renderPriorityIcon
}: DevelopmentListProps) => {
  return (
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
                  {item.status !== 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="ml-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
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
  );
};