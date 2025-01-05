import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";
import { Deal } from "@/integrations/supabase/types/deals";

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
}

export const DealCard = ({ deal, onEdit }: DealCardProps) => {
  return (
    <Card 
      className="p-4 hover:shadow-lg transition-all duration-200 cursor-move group border-l-4 border-l-[#1EAEDB] hover:translate-x-1 bg-white dark:bg-gray-800"
      onClick={() => onEdit(deal)}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-gray-100">
          {deal.company_name}
        </h4>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <CreateTaskButton 
            sourceId={deal.id} 
            source="deals" 
            variant="ghost" 
            size="icon" 
          />
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 hover:bg-[#E3F2FD] hover:text-[#1EAEDB] dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deal);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm font-medium text-[#1EAEDB] mb-2">
        ${Number(deal.deal_value).toLocaleString()}
      </p>
      {deal.contact_job_title && (
        <p className="text-xs text-muted-foreground mb-1">{deal.contact_job_title}</p>
      )}
      {deal.notes && (
        <p className="text-xs text-muted-foreground line-clamp-2">{deal.notes}</p>
      )}
      {deal.country && (
        <div className="flex items-center gap-1 mt-2">
          <span>{deal.country_flag}</span>
          <span className="text-xs text-muted-foreground">{deal.country}</span>
        </div>
      )}
    </Card>
  );
};