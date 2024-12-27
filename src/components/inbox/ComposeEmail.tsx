import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Settings2 } from "lucide-react";

export const ComposeEmail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem('make_webhook_url') || '');
  const queryClient = useQueryClient();

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      if (!webhookUrl) {
        throw new Error('Please configure your Make.com webhook URL first');
      }

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

  const handleSave = () => {
    localStorage.setItem('make_webhook_url', webhookUrl);
    toast.success('Webhook URL saved');
    setIsConfigOpen(false);
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button className="flex-1" onClick={() => setIsOpen(true)}>
          Compose Email
        </Button>
        <Button variant="outline" size="icon" onClick={() => setIsConfigOpen(true)}>
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Make.com Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter your Make.com webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <Button onClick={handleSave} className="w-full">
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            sendEmailMutation.mutate();
          }} className="space-y-4">
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
    </>
  );
};