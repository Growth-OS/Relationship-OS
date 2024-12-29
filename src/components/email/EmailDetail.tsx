import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, Star, Clock, Trash, Reply, MoreHorizontal } from "lucide-react";
import { Email } from "@/types/email";
import { format } from "date-fns";

interface EmailDetailProps {
  email: Email | null;
}

export const EmailDetail = ({ email }: EmailDetailProps) => {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select an email to view
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{email.subject}</h1>
            <div className="text-sm text-muted-foreground">
              From: {email.from_email}
              <br />
              Received: {format(new Date(email.received_at), "PPpp")}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Reply className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: email.body || "" }} />
        </Card>
      </div>
    </div>
  );
};