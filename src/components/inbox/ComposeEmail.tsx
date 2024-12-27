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
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const ComposeEmail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const sendEmailMutation = useMutation({
    mutationFn: async ({ to, subject, content }: { 
      to: string; 
      subject: string; 
      content: string; 
    }) => {
      const webhookUrl = localStorage.getItem('make_webhook_url_send');
      if (!webhookUrl) {
        throw new Error('Make.com webhook URL for sending emails not configured');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          content,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send email: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Email sent successfully');
      setIsOpen(false);
      setTo("");
      setSubject("");
      setContent("");
      // Refresh the email list
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: Error) => {
      console.error('Error sending email:', error);
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmailMutation.mutate({ to, subject, content });
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button 
              type="submit" 
              disabled={sendEmailMutation.isPending}
              className="gap-2"
            >
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
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