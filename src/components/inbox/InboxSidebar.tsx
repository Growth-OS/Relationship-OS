import { Card } from "@/components/ui/card";
import { ComposeEmail } from "./ComposeEmail";
import { Button } from "@/components/ui/button";
import { Archive, Inbox, Star, Clock, Trash, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface InboxSidebarProps {
  currentFilter: 'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash' | 'sent';
  onFilterChange: (filter: 'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash' | 'sent') => void;
}

export const InboxSidebar = ({ currentFilter, onFilterChange }: InboxSidebarProps) => {
  return (
    <Card className="col-span-3 p-4 border-gray-100">
      <ComposeEmail />
      
      <div className="space-y-1">
        <Button
          variant="ghost"
          onClick={() => onFilterChange('inbox')}
          className={cn(
            "w-full justify-start",
            currentFilter === 'inbox' && "bg-gray-100/80"
          )}
        >
          <Inbox className="mr-2 h-4 w-4" />
          Inbox
        </Button>

        <Button
          variant="ghost"
          onClick={() => onFilterChange('sent')}
          className={cn(
            "w-full justify-start",
            currentFilter === 'sent' && "bg-gray-100/80"
          )}
        >
          <Send className="mr-2 h-4 w-4" />
          Sent
        </Button>

        <Button
          variant="ghost"
          onClick={() => onFilterChange('starred')}
          className={cn(
            "w-full justify-start",
            currentFilter === 'starred' && "bg-gray-100/80"
          )}
        >
          <Star className="mr-2 h-4 w-4" />
          Starred
        </Button>

        <Button
          variant="ghost"
          onClick={() => onFilterChange('snoozed')}
          className={cn(
            "w-full justify-start",
            currentFilter === 'snoozed' && "bg-gray-100/80"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          Snoozed
        </Button>

        <Button
          variant="ghost"
          onClick={() => onFilterChange('archived')}
          className={cn(
            "w-full justify-start",
            currentFilter === 'archived' && "bg-gray-100/80"
          )}
        >
          <Archive className="mr-2 h-4 w-4" />
          Archived
        </Button>

        <Button
          variant="ghost"
          onClick={() => onFilterChange('trash')}
          className={cn(
            "w-full justify-start",
            currentFilter === 'trash' && "bg-gray-100/80"
          )}
        >
          <Trash className="mr-2 h-4 w-4" />
          Trash
        </Button>
      </div>
    </Card>
  );
};