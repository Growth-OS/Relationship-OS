import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EditorToolbarButtonProps {
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const EditorToolbarButton = ({
  icon: Icon,
  active,
  disabled,
  onClick,
}: EditorToolbarButtonProps) => {
  return (
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
};