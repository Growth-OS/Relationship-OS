import { format } from "date-fns";
import { TableCell, TableRow as UITableRow } from "@/components/ui/table";
import { StatusBadge, PostStatus } from "./StatusBadge";
import { PostActions } from "./PostActions";

interface Post {
  id: string;
  title: string;
  publish_date: string;
  status: PostStatus;
  content?: string;
}

interface TableRowProps {
  post: Post;
  onStatusChange: (postId: string, newStatus: PostStatus) => Promise<void>;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => Promise<void>;
}

export const TableRow = ({ post, onStatusChange, onEdit, onDelete }: TableRowProps) => {
  return (
    <UITableRow>
      <TableCell>{post.title}</TableCell>
      <TableCell>{format(new Date(post.publish_date), "PPP")}</TableCell>
      <TableCell>
        <StatusBadge 
          status={post.status}
          onStatusChange={(newStatus) => onStatusChange(post.id, newStatus)}
        />
      </TableCell>
      <TableCell>
        <PostActions
          postId={post.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </UITableRow>
  );
};