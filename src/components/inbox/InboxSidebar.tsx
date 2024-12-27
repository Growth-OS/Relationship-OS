import { Button } from "@/components/ui/button";
import { ComposeEmail } from "./ComposeEmail";
import { cn } from "@/lib/utils";

interface InboxSidebarProps {
  currentFilter: 'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash';
  onFilterChange: (filter: 'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash') => void;
}

export const InboxSidebar = ({ currentFilter, onFilterChange }: InboxSidebarProps) => {
  const filters = [
    { id: 'inbox', label: 'Inbox' },
    { id: 'starred', label: 'Starred' },
    { id: 'snoozed', label: 'Snoozed' },
    { id: 'archived', label: 'Archived' },
    { id: 'trash', label: 'Trash' },
  ] as const;

  return (
    <div className="col-span-3 space-y-4">
      <ComposeEmail />
      <nav className="space-y-1">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-base font-normal sidebar-item",
              currentFilter === filter.id ? "active" : ""
            )}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};