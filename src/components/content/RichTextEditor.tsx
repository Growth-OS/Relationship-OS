import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { EditorToolbar } from './editor/EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const defaultTemplate = `
<h1>Title Goes Here</h1>

<p>[Opening Hook: Start with a relatable anecdote, a bold statement, or a thought-provoking question. Keep it conversational to grab attention.]</p>

<hr>

<h2>What You'll Learn</h2>
<p>In this post, we'll explore <strong>[main topic]</strong> and cover:</p>
<ul>
  <li><strong>Key Point 1</strong>: [Brief summary of what this is]</li>
  <li><strong>Key Point 2</strong>: [Brief summary]</li>
  <li><strong>Key Point 3</strong>: [Brief summary]</li>
</ul>

<hr>

<h2>The Problem</h2>
<p>[Describe the challenge or pain point your readers face in a conversational tone. Make it relatable by framing it as something they might think or say: "If you've ever felt like…"]</p>

<hr>

<h2>The Solution</h2>
<p>[Present your main insight or solution. Use simple, clear language and preview the actionable steps to come.]</p>

<hr>

<h2>Key Insights</h2>

<h3>1. First Insight</h3>
<p>[Explanation supported by data, examples, or a relatable analogy. Use short paragraphs and conversational phrasing.]</p>

<h3>2. Second Insight</h3>
<p>[Explanation with practical implications. Focus on how readers can apply this insight.]</p>

<h3>3. Third Insight</h3>
<p>[Keep it clear and actionable. If relevant, link back to the problem.]</p>

<hr>

<h2>Real-World Example</h2>
<p>[Share a specific case study or story. Frame it as "Here's what happened when…" to engage readers and make it practical.]</p>

<hr>

<h2>Actionable Steps</h2>
<ul>
  <li><strong>Step 1</strong>: [Action item with a brief explanation of why it matters]</li>
  <li><strong>Step 2</strong>: [Action item tied to one of the insights]</li>
  <li><strong>Step 3</strong>: [Action item with a clear outcome or result]</li>
</ul>

<hr>

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Takeaway 1</strong>: [Summarise the first key point]</li>
  <li><strong>Takeaway 2</strong>: [Summarise the second key point]</li>
  <li><strong>Takeaway 3</strong>: [Wrap up with a memorable conclusion]</li>
</ul>

<hr>

<h2>What's Next?</h2>
<p>[End with a conversational call to action, such as inviting readers to try something, share their experiences, or respond in the comments.]</p>
`;

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
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
      <div className="p-4 min-h-[200px] prose max-w-none [&_.task-list]:list-none [&_.task-list_p]:inline-block [&_.task-list_label]:inline-flex [&_.task-list_input]:mr-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};