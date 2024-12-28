import { UnifiedInbox } from "@/components/inbox/UnifiedInbox";

const UnifiedInboxPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Unified Inbox</h1>
      </div>
      <UnifiedInbox />
    </div>
  );
};

export default UnifiedInboxPage;