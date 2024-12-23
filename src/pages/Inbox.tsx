import { useEffect, useState } from "react";
import { Mail, Archive, Trash2, Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Inbox = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  const handleGoogleAuth = async () => {
    // TODO: Implement Google OAuth flow
    console.log("Connecting to Google...");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Inbox</h1>
        <p className="text-gray-600">Manage your emails efficiently</p>
      </div>

      {!isConnected ? (
        <Card className="p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold">Connect Your Gmail Account</h2>
          <p className="text-gray-600">
            Connect your Gmail account to start managing your emails directly from Growth OS
          </p>
          <Button onClick={handleGoogleAuth} size="lg">
            Connect Gmail
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <Card className="col-span-3 p-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Inbox
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Star className="mr-2 h-4 w-4" />
                Starred
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Clock className="mr-2 h-4 w-4" />
                Snoozed
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Archive className="mr-2 h-4 w-4" />
                Archived
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Trash
              </Button>
            </div>
          </Card>

          {/* Email List */}
          <Card className="col-span-9 p-0 flex flex-col">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {/* Placeholder emails */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Sender Name</p>
                        <p className="text-sm font-medium">Email Subject</p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          Email preview text goes here...
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">12:34 PM</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Inbox;