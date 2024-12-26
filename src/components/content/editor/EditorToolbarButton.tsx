import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorToolbarButtonProps {
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  tooltip?: string;
}

export const EditorToolbarButton = ({
  icon: Icon,
  active,
  disabled,
  onClick,
  tooltip,
}: EditorToolbarButtonProps) => {
  const button = (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={active ? 'bg-muted' : ''}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};