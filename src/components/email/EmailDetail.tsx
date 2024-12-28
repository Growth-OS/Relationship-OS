import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Mail } from "lucide-react";

interface EmailDetailProps {
  email: {
    from_email: string;
    subject: string;
    body: string | null;
    received_at: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailDetail = ({ email, isOpen, onClose }: EmailDetailProps) => {
  if (!email) return null;

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
      </DialogContent>
    </Dialog>
  );
};