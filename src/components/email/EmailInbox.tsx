import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmailList } from "./EmailList";
import { EmailDetail } from "./EmailDetail";
import { useState } from "react";
import { EmailMessage } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";

export const EmailInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);

  const { data: emails, isLoading } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('received_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });

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