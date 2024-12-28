import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox, Archive, Star, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Message } from './types';
import { MessageList } from './MessageList';
import { MessageFilters } from './MessageFilters';

export const UnifiedInbox = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  
  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ['unified-messages', filter],
    queryFn: async () => {
      let query = supabase
        .from('unified_messages')
        .select('*')
        .order('received_at', { ascending: false });

      switch (filter) {
        case 'unread':
          query = query.eq('is_read', false);
          break;
        case 'starred':
          query = query.eq('is_starred', true);
          break;
        case 'archived':
          query = query.eq('is_archived', true);
          break;
        default:
          query = query.eq('is_archived', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Message[];
    }
  });

  const syncMessages = async () => {
    try {
      const { error } = await supabase.functions.invoke('unipile-sync');
      if (error) throw error;
      
      await refetch();
      toast.success('Messages synced successfully');
    } catch (error) {
      console.error('Error syncing messages:', error);
      toast.error('Failed to sync messages');
    }
  };

  useEffect(() => {
    syncMessages();
  }, []);

  return (
    <Card className="flex flex-col h-[calc(100vh-13rem)]">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Inbox className="w-5 h-5" />
          Unified Inbox
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={syncMessages}
          disabled={isLoading}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Sync
        </Button>
      </div>

      <MessageFilters 
        currentFilter={filter}
        onFilterChange={setFilter}
        counts={{
          all: messages?.filter(m => !m.is_archived).length ?? 0,
          unread: messages?.filter(m => !m.is_read).length ?? 0,
          starred: messages?.filter(m => m.is_starred).length ?? 0,
          archived: messages?.filter(m => m.is_archived).length ?? 0,
        }}
      />

      <MessageList 
        messages={messages ?? []}
        isLoading={isLoading}
        onRefresh={refetch}
      />
    </Card>
  );
};