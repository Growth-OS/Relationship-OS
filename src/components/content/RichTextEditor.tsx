import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { EditorToolbar } from './editor/EditorToolbar';
import { ImageUploader } from './editor/ImageUploader';
import { useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
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

  // Debounce function to avoid too many API calls
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
        
        // Add new highlights for each correction
        data.corrections.forEach((correction: any) => {
          const from = text.indexOf(correction.original);
          if (from >= 0) {
            const to = from + correction.original.length;
            editor.chain().focus().setTextSelection({ from, to }).setMark('highlight', {
              'data-correction': JSON.stringify(correction),
              class: 'bg-yellow-200 cursor-pointer relative group',
            }).run();
            
            // Create tooltip with suggestion
            const element = editor.view.dom.querySelector(`[data-correction='${JSON.stringify(correction)}']`);
            if (element) {
              element.addEventListener('click', () => {
                editor.chain().focus()
                  .setTextSelection({ from, to })
                  .insertContent(correction.suggested)
                  .run();
                toast.success("Correction applied");
              });
            }
          }
        });
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
    <div className="bg-white rounded-lg shadow-sm border">
      <EditorToolbar editor={editor} onImageClick={handleImageClick} />
      <ImageUploader editor={editor} />
      <div className="max-w-4xl mx-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};