import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface EditorHeaderProps {
  title: string;
  isSaving: boolean;
  onSave: () => void;
  onClose?: () => void;
  onTitleChange: (title: string) => void;
}

export const EditorHeader = ({ 
  title, 
  isSaving, 
  onSave, 
  onClose,
  onTitleChange 
}: EditorHeaderProps) => {
  return (
    <div className="flex items-center justify-between sticky top-0 z-20 bg-background p-4 border-b">
      <div className="flex-1 max-w-2xl">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-lg font-semibold"
          placeholder="Enter post title"
        />
      </div>
      <div className="flex items-center space-x-2 ml-4">
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