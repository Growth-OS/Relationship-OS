import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { EditorToolbar } from './editor/EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const defaultTemplate = `
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
`;

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content || defaultTemplate,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="p-4 min-h-[200px] prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};