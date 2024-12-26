import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";

interface SpellCheckButtonProps {
  editor: Editor;
}

export const SpellCheckButton = ({ editor }: SpellCheckButtonProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
      >
        <BookOpen className="h-4 w-4" />
        Grammar Check Active
      </Button>
    </div>
  );
};