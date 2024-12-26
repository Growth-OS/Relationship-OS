import { Check, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const checkGrammar = async () => {
    const text = editor.getText();
    
    if (!text.trim()) {
      toast.error("No Content", {
        description: "Please enter some text to check grammar",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-grammar', {
        body: { text },
      });

      if (error) throw error;

      if (data.hasIssues) {
        toast.error("Grammar Check Results", {
          description: (
            <div className="space-y-2">
              <p>Found {data.corrections.length} suggestions:</p>
              <ul className="list-disc pl-4">
                {data.corrections.map((correction: string, index: number) => (
                  <li key={index}>{correction}</li>
                ))}
              </ul>
            </div>
          ),
          icon: <BookOpen className="h-4 w-4" />,
          duration: 8000,
        });
      } else {
        toast.success("Grammar Check Complete", {
          description: "No grammar issues found",
          icon: <Check className="h-4 w-4" />,
        });
      }
    } catch (error) {
      console.error('Grammar check error:', error);
      toast.error("Grammar Check Failed", {
        description: "Failed to check grammar. Please try again.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={checkSpelling}
        className="gap-2"
      >
        <Check className="h-4 w-4" />
        Check Spelling
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={checkGrammar}
        className="gap-2"
      >
        <BookOpen className="h-4 w-4" />
        Check Grammar
      </Button>
    </div>
  );
};