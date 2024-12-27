import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export const ComposeEmail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const webhookUrl = localStorage.getItem('make_webhook_url_send');
    if (!webhookUrl) {
      toast.error('Please configure the Make.com webhook URL for sending emails');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      toast.success('Email sent successfully');
      setIsOpen(false);
      setTo("");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-4">
          Compose
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <Input
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Write your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};