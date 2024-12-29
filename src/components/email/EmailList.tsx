import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailDetail } from "./EmailDetail";
import { EmailListItem } from "./EmailListItem";
import { useEmails, type Email } from "./hooks/useEmails";
import { supabase } from "@/integrations/supabase/client";

export const EmailList = ({ className }: { className?: string }) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const { data: emails = [], isLoading, refetch } = useEmails();

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.is_read) {
      await supabase
        .from("emails")
        .update({ is_read: true })
        .eq("id", email.id);
      refetch();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ScrollArea className={`h-[calc(100vh-13rem)] ${className}`}>
        <div className="space-y-1">
          {emails.map((email) => (
            <EmailListItem
              key={email.id}
              email={email}
              onEmailClick={handleEmailClick}
              onRefetch={refetch}
            />
          ))}
        </div>
      </ScrollArea>
      
      <EmailDetail 
        email={selectedEmail}
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
      />
    </>
  );
};