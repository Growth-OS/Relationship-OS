import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmailList } from "./EmailList";
import { EmailDetail } from "./EmailDetail";
import { useState, useEffect } from "react";
import { EmailMessage } from "@/integrations/supabase/types/email";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { EmailCompose } from "./EmailCompose";

export const EmailInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const { toast } = useToast();

  const { data: emails, isLoading, error } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      console.log("Fetching emails from Unipile...");
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user?.id);
      
      const { data: connection, error: connError } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'google')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (connError) {
        console.error("Error checking OAuth connection:", connError);
        throw connError;
      }

      if (!connection) {
        console.log("No Google connection found");
        return [];
      }

      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/fetch-emails`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        }
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Error fetching emails:", error);
        throw new Error(error);
      }

      const data = await response.json();
      console.log("Fetched emails from Unipile:", data);
      return data.items || [];
    }
  });

  useEffect(() => {
    console.log("Setting up realtime subscription...");
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emails'
        },
        (payload) => {
          console.log("New email received:", payload);
          toast({
            title: "New Email",
            description: `From: ${payload.new.from_name || payload.new.from_email}`,
          });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (error) {
    console.error("Render error:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading emails: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-13rem)]">
      <div className="border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button 
            onClick={() => setIsComposeOpen(true)}
            className="w-full"
          >
            <PenSquare className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>
        <EmailList 
          emails={emails || []} 
          selectedEmail={selectedEmail}
          onSelectEmail={setSelectedEmail}
        />
      </div>
      <EmailDetail email={selectedEmail} />
      <EmailCompose 
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
};
