import { Card } from "@/components/ui/card";
import { EmailList } from "@/components/inbox/EmailList";
import { InboxSidebar } from "@/components/inbox/InboxSidebar";
import { SearchBar } from "@/components/inbox/SearchBar";
import { useState } from "react";

const Inbox = () => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Inbox</h1>
        <p className="text-gray-600">Manage your emails efficiently</p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        <InboxSidebar />
        <Card className="col-span-9 p-0 flex flex-col">
          <SearchBar />
          <EmailList 
            selectedMessageId={selectedMessageId}
            setSelectedMessageId={setSelectedMessageId}
          />
        </Card>
      </div>
    </div>
  );
};

export default Inbox;