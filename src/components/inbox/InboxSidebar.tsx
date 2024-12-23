import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Star, Clock, Archive, Trash2 } from "lucide-react";
import { ComposeEmail } from "./ComposeEmail";

export const InboxSidebar = () => {
  return (
    <Card className="col-span-3 p-4">
      <ComposeEmail />
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
  );
};