import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailDetailProps {
  email: {
    id: string;
    from_email: string;
    subject: string;
    body: string | null;
    received_at: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailDetail = ({ email, isOpen, onClose }: EmailDetailProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!email) return null;

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setIsSending(true);
    try {
      const { data: connection } = await supabase
        .from("oauth_connections")
        .select("id")
        .eq("provider", "google")
        .single();

      if (!connection) {
        toast.error("No Google account connected");
        return;
      }

      const response = await supabase.functions.invoke("send-email", {
        body: {
          accountId: connection.id, // Using the oauth connection id instead of account_id
          to: [{ identifier: email.from_email }],
          subject: `Re: ${email.subject}`,
          body: replyContent,
          replyTo: email.id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Reply sent successfully");
      setIsReplying(false);
      setReplyContent("");
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start space-x-2">
            <Mail className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <DialogTitle className="text-xl font-semibold mb-2">{email.subject}</DialogTitle>
              <div className="text-sm text-gray-600 space-y-1">
                <p>From: {email.from_email}</p>
                <p>Received: {format(new Date(email.received_at), "PPP 'at' p")}</p>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6 prose prose-sm dark:prose-invert max-w-none">
          {email.body ? (
            <div dangerouslySetInnerHTML={{ __html: email.body }} />
          ) : (
            <p className="text-gray-500 italic">No content available</p>
          )}
        </div>

        <div className="mt-6">
          {!isReplying ? (
            <Button onClick={() => setIsReplying(true)}>
              Reply
            </Button>
          ) : (
            <div className="space-y-4">
              <Textarea
                placeholder="Type your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleReply} 
                  disabled={isSending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? "Sending..." : "Send Reply"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                  disabled={isSending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};