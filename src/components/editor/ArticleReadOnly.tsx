import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { TiptapDoc } from '../../types';
import { getArticleExtensions } from './extensions';

interface ArticleReadOnlyProps {
  lang: 'zh' | 'en';
  content: TiptapDoc;
  className?: string;
}

// Read-only render of a Tiptap doc — used for the editor's preview pane and
// the public article page, so both always match the live editor exactly
// (same extensions, same figure-caption numbering logic).
export const ArticleReadOnly: React.FC<ArticleReadOnlyProps> = ({ lang, content, className }) => {
  const editor = useEditor({
    extensions: getArticleExtensions(lang),
    content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none focus:outline-none prose-headings:font-huninn prose-headings:text-[#023047] prose-headings:font-black',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(content);
    if (current !== next) editor.commands.setContent(content);
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
};
