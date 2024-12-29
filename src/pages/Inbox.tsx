import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EmailList } from "@/components/email/EmailList";
import { LinkedInInbox } from "@/components/email/LinkedInInbox";
import { ComposeEmail } from "@/components/email/ComposeEmail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";

const Inbox = () => {
  const [isComposing, setIsComposing] = useState(false);
  const location = useLocation();
  const isEmailInbox = location.pathname.includes("/email");

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">
            {isEmailInbox ? "Email Inbox" : "LinkedIn Messages"}
          </h1>
          <p className="text-sm text-gray-600">Manage your messages</p>
        </div>
        {isEmailInbox && (
          <Button onClick={() => setIsComposing(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Compose
          </Button>
        )}
      </div>
      
      <Card className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {isEmailInbox ? (
            <>
              <EmailList className="flex-1" />
              {isComposing && (
                <ComposeEmail 
                  onClose={() => setIsComposing(false)}
                  className="w-[600px] border-l"
                />
              )}
            </>
          ) : (
            <LinkedInInbox />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Inbox;