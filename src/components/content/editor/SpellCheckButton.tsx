import { Check, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface SpellCheckButtonProps {
  editor: Editor;
}

interface Correction {
  original: string;
  suggestion: string;
  selected?: boolean;
}

export const SpellCheckButton = ({ editor }: SpellCheckButtonProps) => {
  const [corrections, setCorrections] = useState<Correction[]>([]);

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

  const toggleCorrection = (index: number) => {
    setCorrections(prev => 
      prev.map((correction, i) => 
        i === index ? { ...correction, selected: !correction.selected } : correction
      )
    );
  };

  const applySelectedCorrections = () => {
    let updatedContent = editor.getText();
    let hasChanges = false;

    corrections.forEach(correction => {
      if (correction.selected) {
        // Use replace with a global regex instead of replaceAll
        const regex = new RegExp(correction.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        updatedContent = updatedContent.replace(regex, correction.suggestion);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      editor.commands.setContent(updatedContent);
      toast.success("Changes Applied", {
        description: "Selected grammar corrections have been applied",
        icon: <Check className="h-4 w-4" />,
      });
      setCorrections([]); // Clear corrections after applying
    } else {
      toast.info("No Changes", {
        description: "Please select corrections to apply",
        icon: <AlertCircle className="h-4 w-4" />,
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

      if (data.corrections && data.corrections.length > 0) {
        const newCorrections = data.corrections.map((correction: any) => ({
          original: correction.original,
          suggestion: correction.suggested,
          selected: false
        }));
        
        setCorrections(newCorrections);

        toast.error("Grammar Check Results", {
          description: (
            <div className="space-y-2">
              <p>Found {newCorrections.length} suggestions:</p>
              <ul className="list-none pl-0 space-y-2">
                {newCorrections.map((correction, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Checkbox
                      id={`correction-${index}`}
                      checked={correction.selected}
                      onCheckedChange={() => toggleCorrection(index)}
                    />
                    <label 
                      htmlFor={`correction-${index}`} 
                      className="text-sm cursor-pointer select-none"
                    >
                      Replace "{correction.original}" with "{correction.suggestion}"
                    </label>
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                onClick={applySelectedCorrections}
                className="mt-2"
              >
                Apply Selected Changes
              </Button>
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