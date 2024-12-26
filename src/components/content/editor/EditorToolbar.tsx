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
  LayoutTemplate,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const insertBlogTemplate = () => {
    editor.chain()
      .focus()
      .clearContent()
      .insertContent(`
        <h1>Title Goes Here</h1>
        
        <p>[Opening Hook: Start with a relatable anecdote or thought-provoking question]</p>
        
        <h2>What You'll Learn</h2>
        <p>In this post, we'll explore [main topic] and you'll learn:</p>
        <ul>
          <li>Key point 1</li>
          <li>Key point 2</li>
          <li>Key point 3</li>
        </ul>
        
        <h2>The Problem</h2>
        <p>[Describe the challenge or pain point your readers face]</p>
        
        <h2>The Solution</h2>
        <p>[Present your main insights and solutions]</p>
        
        <h2>Key Insights</h2>
        <ol>
          <li><strong>First Insight</strong><br>[Explanation with data or example]</li>
          <li><strong>Second Insight</strong><br>[Explanation with data or example]</li>
          <li><strong>Third Insight</strong><br>[Explanation with data or example]</li>
        </ol>
        
        <h2>Real-World Example</h2>
        <p>[Share a specific case study or story]</p>
        
        <h2>Actionable Steps</h2>
        <ul>
          <li>Step 1: [Action item]</li>
          <li>Step 2: [Action item]</li>
          <li>Step 3: [Action item]</li>
        </ul>
        
        <h2>Key Takeaways</h2>
        <ul>
          <li>Takeaway 1</li>
          <li>Takeaway 2</li>
          <li>Takeaway 3</li>
        </ul>
        
        <h2>What's Next?</h2>
        <p>[Call to action and invitation to engage]</p>
      `)
      .run();
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
        onClick={insertBlogTemplate}
        icon={LayoutTemplate}
        tooltip="Insert Blog Template"
      />
      <ImageUploader editor={editor} />
    </div>
  );
};