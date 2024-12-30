import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BoardToolbarButtonProps {
  icon: LucideIcon;
  tooltip: string;
  onClick: () => void;
  active?: boolean;
}

export const BoardToolbarButton = ({ 
  icon: Icon, 
  tooltip, 
  onClick, 
  active 
}: BoardToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "secondary" : "ghost"}
          size="icon"
          onClick={onClick}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};