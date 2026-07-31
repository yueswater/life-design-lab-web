import React, { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { TiptapDoc } from '../../types';
import { getArticleExtensions } from './extensions';
import { EditorToolbar, EditorToolbarRef } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { ImageCropModal } from './ImageCropModal';
import { uploadArticleImage } from '../../lib/articles-api';

interface ArticleEditorProps {
  lang: 'zh' | 'en';
  content: TiptapDoc;
  onChange: (doc: TiptapDoc) => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ lang, content, onChange }) => {
  const [uploading, setUploading] = React.useState(false);
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const toolbarRef = useRef<EditorToolbarRef>(null);

  const editor = useEditor({
    extensions: getArticleExtensions(lang, lang === 'zh' ? '開始撰寫內文…或輸入 / 插入區塊' : 'Start writing… or type / to insert a block', true),
    content,
    onUpdate: ({ editor: e }) => onChange(e.getJSON()),
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none px-4 py-4 focus:outline-none min-h-[320px] prose-headings:font-huninn prose-headings:text-[#023047] prose-headings:font-black',
      },
    },
  });

  // Swap content when switching between zh/en tabs (different editor per
  // language would lose scroll/selection state on tab change otherwise).
  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(content);
    if (current !== next) editor.commands.setContent(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, lang]);

  // The "/insert image" slash command can't open a file picker itself
  // (no DOM input to trigger), so it dispatches this event and we forward
  // it to the real file input living in the toolbar.
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;
    const handler = () => toolbarRef.current?.openFilePicker();
    dom.addEventListener('article-editor:request-image', handler);
    return () => dom.removeEventListener('article-editor:request-image', handler);
  }, [editor]);

  if (!editor) return null;

  const handleCropConfirm = async (blob: Blob) => {
    setPendingFile(null);
    setUploading(true);
    try {
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      const url = await uploadArticleImage(file);
      editor.chain().focus().insertContent({ type: 'articleImage', attrs: { src: url } }).run();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '圖片上傳失敗，請稍後再試。');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-hidden border border-slate-200 bg-white">
      <EditorToolbar
        ref={toolbarRef}
        editor={editor}
        onUploadImage={(file) => setPendingFile(file)}
        uploading={uploading}
      />
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} />
      {pendingFile && (
        <ImageCropModal
          file={pendingFile}
          onCancel={() => setPendingFile(null)}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
};
