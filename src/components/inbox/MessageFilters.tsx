import { Button } from '@/components/ui/button';
import { Inbox, Mail, Star, Archive } from 'lucide-react';

interface MessageFiltersProps {
  currentFilter: 'all' | 'unread' | 'starred' | 'archived';
  onFilterChange: (filter: 'all' | 'unread' | 'starred' | 'archived') => void;
  counts: {
    all: number;
    unread: number;
    starred: number;
    archived: number;
  };
}

export const MessageFilters = ({ 
  currentFilter, 
  onFilterChange,
  counts 
}: MessageFiltersProps) => {
  return (
    <div className="p-2 border-b flex gap-2 overflow-x-auto">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onFilterChange('all')}
        className="whitespace-nowrap"
      >
        <Inbox className="w-4 h-4 mr-2" />
        All
        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {counts.all}
        </span>
      </Button>

      <Button
        variant={currentFilter === 'unread' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onFilterChange('unread')}
        className="whitespace-nowrap"
      >
        <Mail className="w-4 h-4 mr-2" />
        Unread
        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {counts.unread}
        </span>
      </Button>

      <Button
        variant={currentFilter === 'starred' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onFilterChange('starred')}
        className="whitespace-nowrap"
      >
        <Star className="w-4 h-4 mr-2" />
        Starred
        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {counts.starred}
        </span>
      </Button>

      <Button
        variant={currentFilter === 'archived' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onFilterChange('archived')}
        className="whitespace-nowrap"
      >
        <Archive className="w-4 h-4 mr-2" />
        Archived
        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {counts.archived}
        </span>
      </Button>
    </div>
  );
};