import { EmailMessage } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { Archive, Star, StarOff, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EmailDetailProps {
  email: EmailMessage | null;
}

export const EmailDetail = ({ email }: EmailDetailProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const markAsRead = async () => {
    if (!email?.is_read) {
      const { error } = await supabase
        .from('emails')
        .update({ is_read: true })
        .eq('id', email.id);

      if (error) throw error;
    }
  };

  const { mutate: toggleArchive } = useMutation({
    mutationFn: async () => {
      if (!email) return;
      const { error } = await supabase
        .from('emails')
        .update({ is_archived: !email.is_archived })
        .eq('id', email.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      toast({
        title: "Email archived",
        description: "The email has been moved to the archive"
      });
    }
  });

  const { mutate: toggleStar } = useMutation({
    mutationFn: async () => {
      if (!email) return;
      const { error } = await supabase
        .from('emails')
        .update({ is_starred: !email.is_starred })
        .eq('id', email.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    }
  });

  if (!email) {
    return (
      <div className="p-8 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select an email to view its contents
      </div>
    );
  }

  // Mark email as read when viewed
  markAsRead();

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {email.subject || "(no subject)"}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleStar()}
          >
            {email.is_starred ? (
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            ) : (
              <StarOff className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleArchive()}
          >
            <Archive className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {email.from_name || email.from_email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {email.from_email}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {format(new Date(email.received_at), "PPp")}
          </p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          To: {email.to_emails.join(", ")}
        </p>
        {email.cc_emails && email.cc_emails.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cc: {email.cc_emails.join(", ")}
          </p>
        )}
      </div>

      <div className="prose dark:prose-invert max-w-none">
        {email.body ? (
          <div dangerouslySetInnerHTML={{ __html: email.body }} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No content</p>
        )}
      </div>
    </div>
  );
};