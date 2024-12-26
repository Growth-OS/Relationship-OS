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
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50">
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        icon={<Bold className="h-4 w-4" />}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={<Italic className="h-4 w-4" />}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        icon={<List className="h-4 w-4" />}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        icon={<ListOrdered className="h-4 w-4" />}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        icon={<AlignLeft className="h-4 w-4" />}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        icon={<AlignCenter className="h-4 w-4" />}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        icon={<AlignRight className="h-4 w-4" />}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        icon={<Heading1 className="h-4 w-4" />}
      />
      <EditorToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        icon={<Heading2 className="h-4 w-4" />}
      />
      <ImageUploader editor={editor} />
    </div>
  );
};