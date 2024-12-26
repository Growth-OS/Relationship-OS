import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          onOpenChange(false);
        } else {
          onOpenChange(true);
        }
      }}
    >
      <DialogContent className="max-w-[90vw] w-full h-[90vh] p-0 flex flex-col">
        {selectedPost && (
          <SubstackEditor
            postId={selectedPost.id}
            initialContent={selectedPost.content}
            title={selectedPost.title}
            onClose={() => {
              onClose();
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};