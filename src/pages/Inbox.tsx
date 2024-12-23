import { useEffect, useState } from "react";
import { Mail, Archive, Trash2, Clock, Star, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailList } from "@/components/inbox/EmailList";
import { InboxSidebar } from "@/components/inbox/InboxSidebar";
import { SearchBar } from "@/components/inbox/SearchBar";
import { useLocation } from "react-router-dom";

const Inbox = () => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const location = useLocation();

  const { data: connection, isLoading: isCheckingConnection, refetch: refetchConnection } = useQuery({
    queryKey: ['googleConnection'],
    queryFn: async () => {
      console.log('Checking Google connection...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found');
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'google')
        .maybeSingle();

      if (error) {
        console.error('Connection check error:', error);
        throw error;
      }
      
      console.log('Connection data:', data);
      return data;
    },
  });

  // Check for OAuth redirect and refresh connection data
  useEffect(() => {
    const isOAuthRedirect = location.hash.includes('access_token') || 
                           location.hash.includes('error') || 
                           location.search.includes('code');
    
    if (isOAuthRedirect) {
      console.log('Detected OAuth redirect, refreshing connection data...');
      refetchConnection();
    }
  }, [location, refetchConnection]);

  const handleGoogleAuth = async () => {
    try {
      console.log('Starting Google auth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar.readonly',
          redirectTo: `${window.location.origin}/dashboard/inbox`,
        },
      });

      if (error) {
        console.error('Google auth error:', error);
        throw error;
      }
      
      console.log('Google auth successful:', data);
      toast.success('Successfully connected to Gmail');
      queryClient.invalidateQueries({ queryKey: ['googleConnection'] });
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Failed to connect to Gmail');
    }
  };

  if (isCheckingConnection) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Inbox</h1>
          <p className="text-gray-600">Manage your emails efficiently</p>
        </div>

        <Card className="p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold">Connect Your Gmail Account</h2>
          <p className="text-gray-600">
            Connect your Gmail account to start managing your emails directly from Growth OS
          </p>
          <Button onClick={handleGoogleAuth} size="lg">
            Connect Gmail
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Inbox</h1>
        <p className="text-gray-600">Manage your emails efficiently</p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        <InboxSidebar />
        <Card className="col-span-9 p-0 flex flex-col">
          <SearchBar />
          <EmailList 
            selectedMessageId={selectedMessageId}
            setSelectedMessageId={setSelectedMessageId}
          />
        </Card>
      </div>
    </div>
  );
};

export default Inbox;