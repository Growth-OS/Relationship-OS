import { Card } from "@/components/ui/card";
import { EmailList } from "@/components/email/EmailList";

const Inbox = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-1">Inbox</h1>
        <p className="text-sm text-gray-600">Manage your emails</p>
      </div>
      
      <Card className="p-4">
        <EmailList />
      </Card>
    </div>
  );
};

export default Inbox;