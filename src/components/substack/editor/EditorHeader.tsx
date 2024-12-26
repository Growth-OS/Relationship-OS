import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EditorHeaderProps {
  title: string;
  isSaving: boolean;
  onSave: () => void;
  onClose?: () => void;
}

export const EditorHeader = ({ title, isSaving, onSave, onClose }: EditorHeaderProps) => {
  return (
    <div className="flex items-center justify-between sticky top-0 z-20 bg-background p-4 border-b">
      <h2 className="text-lg font-semibold">Edit Content: {title}</h2>
      <div className="flex items-center space-x-2">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save & Close"}
        </Button>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};