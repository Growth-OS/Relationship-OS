import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePostButton } from "../CreatePostButton";
import { KanbanCard } from "./KanbanCard";

interface Post {
  id: string;
  title: string;
  status: string;
  publish_date: string;
}

interface KanbanColumnProps {
  title: string;
  status: string;
  posts: Post[];
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const KanbanColumn = ({ 
  title, 
  status, 
  posts, 
  onEdit, 
  onDelete 
}: KanbanColumnProps) => {
  const columnPosts = posts?.filter((post) => post.status === status) || [];

  return (
    <Card className="bg-gray-50">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {title} ({columnPosts.length})
          </CardTitle>
          {status === "idea" && (
            <CreatePostButton variant="ghost" size="icon" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-2">
          {columnPosts.map((post) => (
            <KanbanCard
              key={post.id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};