import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor/Editor";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface MessagePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onSave: (message: string) => void;
  onRegenerate: () => Promise<void>;
  isRegenerating?: boolean;
}

export const MessagePreviewModal = ({
  open,
  onOpenChange,
  message,
  onSave,
  onRegenerate,
  isRegenerating = false,
}: MessagePreviewModalProps) => {
  const [editedMessage, setEditedMessage] = useState(message);

  const handleSave = () => {
    onSave(editedMessage);
    onOpenChange(false);
    toast.success("Message updated successfully");
  };

  const handleRegenerate = async () => {
    try {
      await onRegenerate();
      toast.success("Message regenerated successfully");
    } catch (error) {
      console.error("Error regenerating message:", error);
      toast.error("Failed to regenerate message");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Preview Generated Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Editor
            value={editedMessage}
            onChange={setEditedMessage}
            placeholder="Edit message..."
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isRegenerating}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
            <Button onClick={handleSave} disabled={isRegenerating}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};