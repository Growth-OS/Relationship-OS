import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const statusConfig = {
  idea: { label: "Idea", variant: "secondary" },
  draft: { label: "Draft", variant: "default" },
  scheduled: { label: "Scheduled", variant: "warning" },
  live: { label: "Live", variant: "success" },
} as const;

export type PostStatus = keyof typeof statusConfig;

interface StatusBadgeProps {
  status: PostStatus;
  onStatusChange: (status: PostStatus) => void;
}

export const StatusBadge = ({ status, onStatusChange }: StatusBadgeProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge 
            variant={statusConfig[status].variant as any}
            className="cursor-pointer hover:opacity-80"
          >
            {statusConfig[status].label}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(statusConfig).map(([statusKey, { label }]) => (
          <DropdownMenuItem
            key={statusKey}
            onClick={() => onStatusChange(statusKey as PostStatus)}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};