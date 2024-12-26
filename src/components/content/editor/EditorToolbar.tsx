import { type Editor } from '@tiptap/react';
import { EditorToolbarButton } from './EditorToolbarButton';
import { ImageUploader } from './ImageUploader';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  CheckSquare,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const { toast } = useToast();

  const createTask = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create tasks",
          variant: "destructive",
        });
        return;
      }

      // Insert a checkbox in the editor
      editor.chain().focus().insertContent('<input type="checkbox" /> Task: ').run();

      // Get the current content around the cursor
      const from = editor.state.selection.from;
      const to = Math.min(from + 100, editor.state.doc.content.size); // Get up to 100 chars after cursor
      const content = editor.state.doc.textBetween(from, to);
      const taskTitle = content.split('\n')[0].replace('Task:', '').trim();

      // Create task in the database
      const { error } = await supabase.from('tasks').insert({
        title: taskTitle || 'New Task',
        source: 'content',
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50">
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        icon={Bold}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={Italic}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        icon={List}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        icon={ListOrdered}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        icon={AlignLeft}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        icon={AlignCenter}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        icon={AlignRight}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        icon={Heading1}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        icon={Heading2}
      />
      <EditorToolbarButton
        onClick={createTask}
        icon={CheckSquare}
        tooltip="Create Task"
      />
      <ImageUploader editor={editor} />
    </div>
  );
};