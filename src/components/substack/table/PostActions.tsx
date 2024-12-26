import { Button } from "@/components/ui/button";

interface PostActionsProps {
  postId: string;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const PostActions = ({ postId, onEdit, onDelete }: PostActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(postId)}
      >
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={() => onDelete(postId)}
      >
        Delete
      </Button>
    </div>
  );
};