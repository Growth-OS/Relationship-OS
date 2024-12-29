import { Card } from "@/components/ui/card";
import { EmailInbox } from "@/components/email/EmailInbox";

const Emails = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Inbox</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your emails and communications</p>
        </div>
      </div>

      <Card className="p-0">
        <EmailInbox />
      </Card>
    </div>
  );
};

export default Emails;