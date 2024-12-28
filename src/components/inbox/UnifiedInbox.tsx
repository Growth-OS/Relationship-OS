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
  
  // Query to check if Unipile accounts are connected
  const { data: accounts, isLoading: isLoadingAccounts, error: accountsError } = useQuery({
    queryKey: ['unipile-accounts'],
    queryFn: async () => {
      console.log('Fetching Unipile accounts...');
      const { data, error } = await supabase.functions.invoke('unipile-accounts');
      if (error) {
        console.error('Error fetching accounts:', error);
        throw error;
      }
      console.log('Accounts fetched:', data);
      return data;
    },
  });

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
    },
    enabled: !!accounts?.length, // Only fetch messages if accounts are connected
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
    if (accounts?.length > 0) {
      syncMessages();
    }
  }, [accounts]);

  if (isLoadingAccounts) {
    return (
      <Card className="flex items-center justify-center h-[calc(100vh-13rem)]">
        <div className="text-center">
          <RefreshCcw className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p>Checking connected accounts...</p>
        </div>
      </Card>
    );
  }

  if (accountsError) {
    return (
      <Card className="flex items-center justify-center h-[calc(100vh-13rem)]">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Error connecting to Unipile</h3>
          <p className="text-gray-500 mb-4">Please check your API key and try again</p>
          <Button onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </div>
      </Card>
    );
  }

  if (!accounts?.length) {
    return (
      <Card className="flex items-center justify-center h-[calc(100vh-13rem)]">
        <div className="text-center">
          <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No accounts connected</h3>
          <p className="text-gray-500 mb-4">Connect your accounts to start receiving messages</p>
          <Button onClick={() => window.open('https://api6.unipile.com:13619/oauth/authorize', '_blank')}>
            Connect Accounts
          </Button>
        </div>
      </Card>
    );
  }

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