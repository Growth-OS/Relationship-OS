import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Post {
  id: string;
  title: string;
  publish_date: string;
}

interface KanbanCardProps {
  post: Post;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const KanbanCard = ({ post, onEdit, onDelete }: KanbanCardProps) => {
  return (
    <Card key={post.id} className="p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{post.title}</h4>
          <p className="text-xs text-gray-500 mt-1">
            Due: {format(new Date(post.publish_date), "PP")}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(post.id)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Content
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(post.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};