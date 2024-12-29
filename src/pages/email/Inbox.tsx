import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmailMessage } from "@/components/dashboard/types";
import { Mail, Loader2, Star, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const InboxPage = () => {
  const { data: emails, isLoading, refetch } = useQuery({
    queryKey: ["inbox-emails"],
    queryFn: async () => {
      console.log("Fetching inbox emails...");
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .eq("folder", "inbox")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .order("received_at", { ascending: false });

      if (error) {
        console.error("Error fetching emails:", error);
        throw error;
      }
      
      console.log("Fetched emails:", data);
      return data as EmailMessage[];
    },
  });

  const handleArchive = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from("emails")
        .update({ folder: "archived" })
        .eq("id", emailId);

      if (error) throw error;
      toast.success("Email archived");
      refetch();
    } catch (error) {
      console.error("Error archiving email:", error);
      toast.error("Failed to archive email");
    }
  };

  const handleDelete = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from("emails")
        .update({ folder: "trash" })
        .eq("id", emailId);

      if (error) throw error;
      toast.success("Email moved to trash");
      refetch();
    } catch (error) {
      console.error("Error deleting email:", error);
      toast.error("Failed to delete email");
    }
  };

  const handleStar = async (emailId: string, isStarred: boolean) => {
    try {
      const { error } = await supabase
        .from("emails")
        .update({ is_starred: !isStarred })
        .eq("id", emailId);

      if (error) throw error;
      toast.success(isStarred ? "Email unstarred" : "Email starred");
      refetch();
    } catch (error) {
      console.error("Error starring email:", error);
      toast.error("Failed to update email");
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
            Archive All
          </Button>
          <Button variant="outline" size="sm">
            <Star className="w-4 h-4 mr-2" />
            Show Starred
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
              !email.is_read ? "border-l-4 border-blue-500" : ""
            }`}
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
                <p className="text-sm text-gray-600 dark:text-gray-300">{email.subject}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {email.snippet}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStar(email.id, email.is_starred || false);
                    }}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        email.is_starred ? "fill-yellow-400 text-yellow-400" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(email.id);
                    }}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(email.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InboxPage;