import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Star, Archive, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useState } from "react";
import { EmailDetail } from "./EmailDetail";

interface Email {
  id: string;
  from_email: string;
  subject: string;
  snippet: string | null;
  body: string | null;
  received_at: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  is_trashed: boolean;
}

export const EmailList = ({ className }: { className?: string }) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  const { data: emails = [], isLoading, refetch } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .order("received_at", { ascending: false });
      
      if (error) throw error;
      return data as Email[];
    },
    // Add a refetch interval of 60 seconds (1 minute)
    refetchInterval: 60000,
  });

  const handleToggleStar = async (e: React.MouseEvent, emailId: string, isStarred: boolean) => {
    e.stopPropagation();
    await supabase
      .from("emails")
      .update({ is_starred: !isStarred })
      .eq("id", emailId);
  };

  const handleArchive = async (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    await supabase
      .from("emails")
      .update({ is_archived: true })
      .eq("id", emailId);
  };

  const handleTrash = async (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    await supabase
      .from("emails")
      .update({ is_trashed: true })
      .eq("id", emailId);
  };

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
            <div
              key={email.id}
              onClick={() => handleEmailClick(email)}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                !email.is_read ? "bg-blue-50 dark:bg-blue-900/10" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium block text-left">{email.from_email}</span>
                    <h3 className="font-medium text-left mt-1">{email.subject}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 text-left mt-1">{email.snippet}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <span className="text-sm text-gray-500">
                    {format(new Date(email.received_at), "MMM d, h:mm a")}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleToggleStar(e, email.id, email.is_starred)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          email.is_starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleArchive(e, email.id)}
                    >
                      <Archive className="h-4 w-4 text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleTrash(e, email.id)}
                    >
                      <Trash className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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