import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SubstackEditor } from "../SubstackEditor";

interface PostEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: {
    id: string;
    title: string;
    content?: string;
  } | null;
  onClose: () => void;
}

export const PostEditor = ({ 
  isOpen, 
  onOpenChange, 
  selectedPost, 
  onClose 
}: PostEditorProps) => {
  return (
    <Drawer 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DrawerContent className="h-[95vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>
            Edit Content: {selectedPost?.title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 h-full overflow-y-auto">
          {selectedPost && (
            <SubstackEditor
              postId={selectedPost.id}
              initialContent={selectedPost.content}
              title={selectedPost.title}
              onClose={onClose}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};