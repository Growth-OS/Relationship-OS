import { Card } from "@/components/ui/card";
import { EmailList } from "@/components/inbox/EmailList";
import { LinkedInList } from "@/components/inbox/LinkedInList";
import { InboxSidebar } from "@/components/inbox/InboxSidebar";
import { SearchBar } from "@/components/inbox/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Linkedin } from "lucide-react";
import { useState } from "react";
import { useGmailMessages } from "@/hooks/useGmailMessages";
import { Badge } from "@/components/ui/badge";

const Inbox = () => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash' | 'sent'>('inbox');
  const { data: emails } = useGmailMessages();

  // Calculate unread messages
  const unreadCount = emails?.filter(email => !email.is_read && !email.is_archived && !email.is_trashed)?.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
          <p className="text-gray-600">Manage your communications efficiently</p>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <Badge variant="secondary" className="bg-gray-100">
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        <InboxSidebar 
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />
        <Card className="col-span-9 p-0 flex flex-col border-gray-100">
          <Tabs defaultValue="email" className="flex-1">
            <div className="border-b border-gray-100">
              <div className="px-4 pt-2">
                <TabsList className="bg-transparent border-b border-transparent">
                  <TabsTrigger 
                    value="email" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger 
                    value="linkedin"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </TabsTrigger>
                </TabsList>
              </div>
              <SearchBar />
            </div>
            
            <TabsContent value="email" className="flex-1 m-0">
              <EmailList 
                selectedMessageId={selectedMessageId}
                setSelectedMessageId={setSelectedMessageId}
                filter={currentFilter}
              />
            </TabsContent>
            <TabsContent value="linkedin" className="flex-1 m-0">
              <LinkedInList
                selectedMessageId={selectedMessageId}
                setSelectedMessageId={setSelectedMessageId}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Inbox;