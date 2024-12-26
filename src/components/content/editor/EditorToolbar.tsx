import { Editor } from '@tiptap/react';
import { Bold, Italic, List, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { EditorToolbarButton } from "./EditorToolbarButton";

interface EditorToolbarProps {
  editor: Editor;
  onImageClick: () => void;
}

export const EditorToolbar = ({ editor, onImageClick }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="border-b bg-muted/30 p-2 flex gap-2 sticky top-0 z-10">
      <EditorToolbarButton
        icon={Bold}
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <EditorToolbarButton
        icon={Italic}
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <EditorToolbarButton
        icon={List}
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      
      <EditorToolbarButton
        icon={AlignLeft}
        isActive={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <EditorToolbarButton
        icon={AlignCenter}
        isActive={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <EditorToolbarButton
        icon={AlignRight}
        isActive={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />

      <div className="relative">
        <EditorToolbarButton
          icon={ImageIcon}
          onClick={onImageClick}
        />
      </div>
    </div>
  );
};