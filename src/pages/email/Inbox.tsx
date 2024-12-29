import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmailMessage } from "@/components/dashboard/types";
import { Mail, Loader2, Search, Star, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const InboxPage = () => {
  const { data: emails, isLoading } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .eq("folder", "inbox")
        .order("received_at", { ascending: false });

      if (error) throw error;
      return data as EmailMessage[];
    },
  });

  const handleMarkAsRead = async (emailId: string) => {
    const { error } = await supabase
      .from("emails")
      .update({ is_read: true })
      .eq("id", emailId);

    if (error) {
      console.error("Error marking email as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!emails?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-gray-500">
        <Mail className="w-12 h-12 mb-4" />
        <p>Your inbox is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button variant="outline" size="sm">
            <Star className="w-4 h-4 mr-2" />
            Mark as Important
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
              !email.is_read ? "border-l-4 border-blue-500" : ""
            }`}
            onClick={() => handleMarkAsRead(email.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{email.from_name || email.from_email}</p>
                  {!email.is_read && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{email.subject}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {email.snippet}
                </p>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InboxPage;