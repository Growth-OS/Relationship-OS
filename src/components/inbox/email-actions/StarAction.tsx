import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useStarEmail } from "@/hooks/useEmailActions";

interface StarActionProps {
  messageId: string;
  isStarred: boolean;
}

export const StarAction = ({ messageId, isStarred }: StarActionProps) => {
  const starMutation = useStarEmail();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      onClick={() => starMutation.mutate({ messageId, isStarred: !isStarred })}
    >
      <Star className={`h-4 w-4 mr-2 ${isStarred ? 'fill-gray-900 text-gray-900' : ''}`} />
      Star
    </Button>
  );
};