import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ComposeEmail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const email = [
        'From: me',
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        content
      ].join('\n');

      const response = await fetch('/functions/v1/gmail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'sendEmail',
          email 
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success('Email sent successfully');
      setIsOpen(false);
      setTo("");
      setSubject("");
      setContent("");
    },
    onError: (error) => {
      toast.error(`Failed to send email: ${error.message}`);
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmailMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-4">Compose Email</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
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
            <Button 
              type="submit" 
              disabled={sendEmailMutation.isPending}
            >
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};