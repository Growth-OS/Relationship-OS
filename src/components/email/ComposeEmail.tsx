import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ComposeEmailProps {
  onClose: () => void;
  className?: string;
}

export const ComposeEmail = ({ onClose, className }: ComposeEmailProps) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [needsGmailConnection, setNeedsGmailConnection] = useState(false);

  const handleConnectGmail = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('unipile-accounts', {
        body: { provider: 'gmail' }
      });
      
      if (error) throw error;
      
      // If we have accounts, we can proceed with sending
      if (data && data.length > 0) {
        setNeedsGmailConnection(false);
        return;
      }

      // Redirect to Gmail OAuth
      const { data: { url }, error: urlError } = await supabase.functions.invoke('gmail', {
        body: { action: 'get_auth_url' }
      });
      
      if (urlError) throw urlError;
      
      // Store the current path to return after OAuth
      localStorage.setItem('oauth_return_path', '/dashboard/inbox/email');
      
      // Redirect to Gmail auth
      window.location.href = url;
    } catch (error) {
      console.error("Error connecting Gmail:", error);
      toast.error("Failed to connect Gmail account");
    }
  };

  const handleSend = async () => {
    if (!to || !subject || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSending(true);
    try {
      console.log("Sending email to:", to);
      const response = await supabase.functions.invoke("send-email", {
        body: {
          to: [{ identifier: to }],
          subject,
          body: content,
        },
      });

      if (response.error) {
        // Check if the error is due to no email accounts
        if (response.error.message.includes("No email accounts found")) {
          setNeedsGmailConnection(true);
          return;
        }
        throw response.error;
      }

      toast.success("Email sent successfully");
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  if (needsGmailConnection) {
    return (
      <div className={cn("bg-white dark:bg-gray-800 p-4 flex flex-col h-full", className)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Connect Gmail</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Alert className="mb-4">
          <AlertDescription>
            To send emails, you need to connect your Gmail account first.
          </AlertDescription>
        </Alert>

        <Button onClick={handleConnectGmail}>
          Connect Gmail Account
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("bg-white dark:bg-gray-800 p-4 flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">New Message</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 flex-1">
        <Input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          placeholder="Write your message..."
          className="flex-1 min-h-[300px] resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSend} 
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};