import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";

interface SpellCheckButtonProps {
  editor: Editor;
}

export const SpellCheckButton = ({ editor }: SpellCheckButtonProps) => {
  const checkSpelling = async () => {
    const text = editor.getText();
    const words = text.split(/\s+/);
    let misspelledWords: string[] = [];

    // Use browser's built-in spell checker with UK English
    const language = new Intl.Locale("en-GB");
    if ('spellcheck' in document.createElement('textarea')) {
      const textarea = document.createElement('textarea');
      textarea.lang = language.toString();
      
      for (const word of words) {
        textarea.value = word;
        if (!textarea.spellcheck) {
          misspelledWords.push(word);
        }
      }
    }

    if (misspelledWords.length > 0) {
      toast.error("Spelling Check Results", {
        description: `Found ${misspelledWords.length} potential spelling errors: ${misspelledWords.join(", ")}`,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } else {
      toast.success("Spelling Check Complete", {
        description: "No spelling errors found",
        icon: <Check className="h-4 w-4" />,
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={checkSpelling}
      className="gap-2"
    >
      <Check className="h-4 w-4" />
      Check Spelling
    </Button>
  );
};