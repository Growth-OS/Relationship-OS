import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { EditorToolbar } from './editor/EditorToolbar';
import { ImageUploader } from './editor/ImageUploader';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [corrections, setCorrections] = useState<Array<{ original: string; suggested: string }>>([]);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      debouncedCheckGrammar();
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
  });

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const checkGrammar = async () => {
    if (!editor) return;
    
    const text = editor.getText();
    if (!text.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-grammar', {
        body: { text },
      });

      if (error) throw error;

      if (data.corrections && data.corrections.length > 0) {
        // Remove existing marks
        editor.commands.unsetMark('highlight');
        
        // Store corrections for later use
        setCorrections(data.corrections);
        
        // Add new highlights for each correction
        data.corrections.forEach((correction: any) => {
          const from = text.indexOf(correction.original);
          if (from >= 0) {
            const to = from + correction.original.length;
            editor.chain().focus().setTextSelection({ from, to }).setMark('highlight', {
              class: 'bg-yellow-100/50 cursor-pointer grammar-highlight',
            }).run();
          }
        });

        // Add click handlers to highlighted text
        const highlights = editor.view.dom.querySelectorAll('.grammar-highlight');
        highlights.forEach((element) => {
          element.addEventListener('click', (e) => {
            const text = (e.target as HTMLElement).textContent;
            const correction = corrections.find(c => c.original === text);
            if (correction) {
              const from = editor.getText().indexOf(correction.original);
              const to = from + correction.original.length;
              editor.chain().focus()
                .setTextSelection({ from, to })
                .insertContent(correction.suggested)
                .run();
              toast.success("Correction applied");
            }
          });
        });

        toast.info(`Found ${data.corrections.length} grammar suggestion${data.corrections.length > 1 ? 's' : ''}. Click on highlighted text to apply suggestions.`);
      }
    } catch (error) {
      console.error('Grammar check error:', error);
    }
  };

  const debouncedCheckGrammar = useCallback(debounce(checkGrammar, 1000), []);

  useEffect(() => {
    if (editor) {
      debouncedCheckGrammar();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleImageClick = () => {
    document.getElementById('image-upload')?.click();
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-lg shadow-sm border">
        <EditorToolbar editor={editor} onImageClick={handleImageClick} />
        <ImageUploader editor={editor} />
        <div className="max-w-4xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </TooltipProvider>
  );
};