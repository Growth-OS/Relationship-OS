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
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleTaskCreated = (taskTitle: string) => {
    // Insert the task reference in the editor
    editor.chain().focus().insertContent(`<input type="checkbox" /> ${taskTitle}`).run();
    setIsTaskDialogOpen(false);
  };

  return (
    <>
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
          onClick={() => setIsTaskDialogOpen(true)}
          icon={CheckSquare}
          tooltip="Create Task"
        />
        <ImageUploader editor={editor} />
      </div>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <CreateTaskForm
            source="content"
            onSuccess={(taskTitle) => {
              handleTaskCreated(taskTitle);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};