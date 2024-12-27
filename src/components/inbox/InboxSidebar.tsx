import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Star, Clock, Archive, Trash2 } from "lucide-react";
import { ComposeEmail } from "./ComposeEmail";

interface InboxSidebarProps {
  currentFilter: 'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash';
  onFilterChange: (filter: 'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash') => void;
}

export const InboxSidebar = ({ currentFilter, onFilterChange }: InboxSidebarProps) => {
  return (
    <Card className="col-span-3 p-4 border-gray-100">
      <ComposeEmail />
      <div className="space-y-1">
        <Button 
          variant={currentFilter === 'inbox' ? 'default' : 'ghost'} 
          className="w-full justify-start text-sm h-9" 
          size="sm"
          onClick={() => onFilterChange('inbox')}
        >
          <Mail className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Inbox</span>
        </Button>
        <Button 
          variant={currentFilter === 'starred' ? 'default' : 'ghost'}
          className="w-full justify-start text-sm h-9" 
          size="sm"
          onClick={() => onFilterChange('starred')}
        >
          <Star className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Starred</span>
        </Button>
        <Button 
          variant={currentFilter === 'snoozed' ? 'default' : 'ghost'}
          className="w-full justify-start text-sm h-9" 
          size="sm"
          onClick={() => onFilterChange('snoozed')}
        >
          <Clock className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Snoozed</span>
        </Button>
        <Button 
          variant={currentFilter === 'archived' ? 'default' : 'ghost'}
          className="w-full justify-start text-sm h-9" 
          size="sm"
          onClick={() => onFilterChange('archived')}
        >
          <Archive className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Archived</span>
        </Button>
        <Button 
          variant={currentFilter === 'trash' ? 'default' : 'ghost'}
          className="w-full justify-start text-sm h-9" 
          size="sm"
          onClick={() => onFilterChange('trash')}
        >
          <Trash2 className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Trash</span>
        </Button>
      </div>
    </Card>
  );
};