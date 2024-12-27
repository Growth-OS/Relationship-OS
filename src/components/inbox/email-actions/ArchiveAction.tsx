import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { useArchiveEmail } from "@/hooks/useArchiveEmail";

interface ArchiveActionProps {
  messageId: string;
}

export const ArchiveAction = ({ messageId }: ArchiveActionProps) => {
  const archiveMutation = useArchiveEmail();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      onClick={() => archiveMutation.mutate(messageId)}
    >
      <Archive className="h-4 w-4 mr-2" />
      Archive
    </Button>
  );
};