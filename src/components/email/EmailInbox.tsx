import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Inbox, Archive, Trash, Clock, Star } from "lucide-react";
import { EmailList } from "./EmailList";
import { EmailDetail } from "./EmailDetail";
import { useState } from "react";
import { Email } from "@/types/email";

export const EmailInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const { data: emails, isLoading } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .order("received_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="flex h-[calc(100vh-10rem)] overflow-hidden">
      <div className="w-64 border-r border-border p-4 space-y-4">
        <div className="space-y-2">
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-accent">
            <Inbox className="w-4 h-4" />
            <span>Inbox</span>
          </button>
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-accent">
            <Star className="w-4 h-4" />
            <span>Starred</span>
          </button>
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-accent">
            <Clock className="w-4 h-4" />
            <span>Snoozed</span>
          </button>
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-accent">
            <Archive className="w-4 h-4" />
            <span>Archived</span>
          </button>
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-accent">
            <Trash className="w-4 h-4" />
            <span>Trash</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        <EmailList 
          emails={emails || []} 
          isLoading={isLoading}
          selectedEmail={selectedEmail}
          onSelectEmail={setSelectedEmail}
        />
        <EmailDetail email={selectedEmail} />
      </div>
    </Card>
  );
};