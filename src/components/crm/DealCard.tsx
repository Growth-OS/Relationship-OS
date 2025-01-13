import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";
import { Deal, LostReason } from "@/integrations/supabase/types/deals";
import { LostReasonSelect } from "./form-fields/LostReasonSelect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
}

export const DealCard = ({ deal, onEdit }: DealCardProps) => {
  const handleLostReasonChange = async (reason: LostReason) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ lost_reason: reason })
        .eq('id', deal.id);

      if (error) throw error;
      toast.success('Lost reason updated');
    } catch (error) {
      console.error('Error updating lost reason:', error);
      toast.error('Failed to update lost reason');
    }
  };

  return (
    <Card 
      className="p-4 transition-all duration-200 cursor-move group border-l-4 border-l-gray-200 
        hover:translate-x-1 bg-white dark:bg-gray-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)]"
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
            className="h-8 w-8 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deal);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        €{Number(deal.deal_value).toLocaleString()}
      </p>
      {deal.contact_job_title && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{deal.contact_job_title}</p>
      )}
      <div className="flex flex-col gap-2 mt-2">
        {deal.company_website && (
          <a 
            href={deal.company_website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
          >
            Company Website
          </a>
        )}
        {deal.contact_linkedin && (
          <a 
            href={deal.contact_linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
          >
            LinkedIn Profile
          </a>
        )}
      </div>
      {deal.notes && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">{deal.notes}</p>
      )}
      {deal.country && (
        <div className="flex items-center gap-1 mt-2">
          <span>{deal.country_flag}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{deal.country}</span>
        </div>
      )}
      {deal.stage === 'lost' && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <LostReasonSelect
            value={deal.lost_reason}
            onValueChange={handleLostReasonChange}
          />
        </div>
      )}
    </Card>
  );
};