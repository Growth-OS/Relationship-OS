import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTrashEmail } from "@/hooks/useEmailActions";

interface TrashActionProps {
  messageId: string;
}

export const TrashAction = ({ messageId }: TrashActionProps) => {
  const trashMutation = useTrashEmail();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      onClick={() => trashMutation.mutate(messageId)}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Trash
    </Button>
  );
};