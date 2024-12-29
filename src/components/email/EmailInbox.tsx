import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmailList } from "./EmailList";
import { EmailDetail } from "./EmailDetail";
import { useState, useEffect } from "react";
import { EmailMessage } from "@/integrations/supabase/types/email";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export const EmailInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const { toast } = useToast();

  const { data: emails, isLoading, error } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      console.log("Fetching emails for inbox...");
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user?.id);
      
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user?.id)
        .order('received_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error("Error fetching emails:", error);
        throw error;
      }
      console.log("Fetched emails for inbox:", data);
      return data;
    }
  });

  // Subscribe to real-time updates
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
      <EmailList 
        emails={emails || []} 
        selectedEmail={selectedEmail}
        onSelectEmail={setSelectedEmail}
      />
      <EmailDetail email={selectedEmail} />
    </div>
  );
};