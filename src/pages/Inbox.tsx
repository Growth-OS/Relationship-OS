import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EmailList } from "@/components/email/EmailList";
import { LinkedInInbox } from "@/components/email/LinkedInInbox";
import { ComposeEmail } from "@/components/email/ComposeEmail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Inbox = () => {
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Inbox</h1>
          <p className="text-sm text-gray-600">Manage your messages</p>
        </div>
        <Button onClick={() => setIsComposing(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Compose
        </Button>
      </div>
      
      <Card className="flex-1 overflow-hidden">
        <Tabs defaultValue="email" className="h-full">
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="h-[calc(100%-3rem)]">
            <div className="h-full flex">
              <EmailList className="flex-1" />
              {isComposing && (
                <ComposeEmail 
                  onClose={() => setIsComposing(false)}
                  className="w-[600px] border-l"
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="linkedin" className="h-[calc(100%-3rem)]">
            <LinkedInInbox />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Inbox;