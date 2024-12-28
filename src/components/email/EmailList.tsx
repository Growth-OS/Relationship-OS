import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Star, Archive, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Email {
  id: string;
  from_email: string;
  subject: string;
  snippet: string | null;
  received_at: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  is_trashed: boolean;
}

export const EmailList = () => {
  const { data: emails = [], isLoading } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .order("received_at", { ascending: false });
      
      if (error) throw error;
      return data as Email[];
    },
  });

  const handleToggleStar = async (emailId: string, isStarred: boolean) => {
    await supabase
      .from("emails")
      .update({ is_starred: !isStarred })
      .eq("id", emailId);
  };

  const handleArchive = async (emailId: string) => {
    await supabase
      .from("emails")
      .update({ is_archived: true })
      .eq("id", emailId);
  };

  const handleTrash = async (emailId: string) => {
    await supabase
      .from("emails")
      .update({ is_trashed: true })
      .eq("id", emailId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
      <div className="space-y-1">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
              !email.is_read ? "bg-blue-50 dark:bg-blue-900/10" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{email.from_email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleStar(email.id, email.is_starred)}
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
                  onClick={() => handleArchive(email.id)}
                >
                  <Archive className="h-4 w-4 text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleTrash(email.id)}
                >
                  <Trash className="h-4 w-4 text-gray-400" />
                </Button>
                <span className="text-sm text-gray-500">
                  {format(new Date(email.received_at), "MMM d, h:mm a")}
                </span>
              </div>
            </div>
            <div className="mt-1">
              <h3 className="font-medium">{email.subject}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{email.snippet}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};