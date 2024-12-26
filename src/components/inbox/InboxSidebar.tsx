import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Star, Clock, Archive, Trash2 } from "lucide-react";
import { ComposeEmail } from "./ComposeEmail";

export const InboxSidebar = () => {
  return (
    <Card className="col-span-3 p-4 border-gray-100">
      <ComposeEmail />
      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start text-sm h-9" size="sm">
          <Mail className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Inbox</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm h-9" size="sm">
          <Star className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Starred</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm h-9" size="sm">
          <Clock className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Snoozed</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm h-9" size="sm">
          <Archive className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Archived</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm h-9" size="sm">
          <Trash2 className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Trash</span>
        </Button>
      </div>
    </Card>
  );
};