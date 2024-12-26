import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EditorToolbarButtonProps {
  icon: LucideIcon;
  isActive?: boolean;
  onClick: () => void;
}

export const EditorToolbarButton = ({
  icon: Icon,
  isActive,
  onClick,
}: EditorToolbarButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={isActive ? 'bg-muted' : ''}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};