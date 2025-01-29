import { format, differenceInDays } from "date-fns";
import { Plane, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreateTravelForm } from "../CreateTravelForm";
import { Travel } from "../types";

interface TravelCardProps {
  travel: Travel;
  onTravelUpdated: () => void;
}

export const TravelCard = ({ travel, onTravelUpdated }: TravelCardProps) => {
  const currentDate = new Date();
  const daysUntilDeparture = differenceInDays(
    new Date(travel.departure_date),
    currentDate
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <div className="flex items-center justify-between gap-4 py-2 border-t first:border-t-0">
            <div className="flex flex-col items-center">
              <div className="text-2xl">{travel.origin_country_flag}</div>
              <span className="text-xs font-medium">{travel.origin_country}</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center gap-2">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200" />
              <Plane className="w-4 h-4 text-primary rotate-0" />
              <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200" />
            </div>

            <div className="flex flex-col items-center">
              <div className="text-2xl">{travel.destination_country_flag}</div>
              <span className="text-xs font-medium">{travel.destination_country}</span>
            </div>

            <div className="min-w-24 text-right">
              <span className="text-xs text-muted-foreground">
                {format(new Date(travel.departure_date), "d MMM")}
              </span>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CreateTravelForm onSuccess={onTravelUpdated} editTravel={travel} />
              </DialogContent>
            </Dialog>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm space-y-1">
            <p>In {daysUntilDeparture} days</p>
            {travel.company_name && (
              <p>Visiting: {travel.company_name}</p>
            )}
            {travel.notes && <p>{travel.notes}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};