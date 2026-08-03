import React, { useState } from 'react';
import Blockquote from '@tiptap/extension-blockquote';
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Trash2 } from 'lucide-react';

// Blockquote with an optional author + book/source attribution, editable via
// two small inputs below the quoted text. Same NodeViewWrapper-as-the-real-tag
// + local-draft-until-blur pattern as ArticleImage's caption input, since
// writing to updateAttributes() on every keystroke would break IME (Zhuyin)
// composition here too.
export interface ArticleBlockquoteOptions {
  lang: 'zh' | 'en';
}

const CJK_PATTERN = /[一-鿿　-〿＀-￯]/;

// A source containing CJK gets book-title marks 《...》, otherwise plain
// curly quotes — same "person vs. work" distinction as the author field.
function quotedSource(source: string): string {
  return CJK_PATTERN.test(source) ? `《${source}》` : `“${source}”`;
}

const ArticleBlockquoteView: React.FC<NodeViewProps> = (props) => {
  const { node, updateAttributes, editor, deleteNode } = props;
  const lang = (editor.extensionManager.extensions.find((e) => e.name === 'blockquote')?.options
    .lang ?? 'zh') as 'zh' | 'en';
  const [hovered, setHovered] = useState(false);

  const [authorDraft, setAuthorDraft] = useState<string | null>(null);
  const [sourceDraft, setSourceDraft] = useState<string | null>(null);
  const author = authorDraft ?? (typeof node.attrs.author === 'string' ? node.attrs.author : '');
  const source = sourceDraft ?? (typeof node.attrs.source === 'string' ? node.attrs.source : '');
  const hasAttribution = Boolean(node.attrs.author || node.attrs.source);

  return (
    <NodeViewWrapper
      as="blockquote"
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {editor.isEditable && hovered && (
        <button
          type="button"
          title={lang === 'zh' ? '刪除引言' : 'Delete quote'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={deleteNode}
          contentEditable={false}
          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-red-600 cursor-pointer"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}

      <NodeViewContent />

      {editor.isEditable ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-2 not-italic" contentEditable={false}>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthorDraft(e.target.value)}
            onBlur={() => {
              if (authorDraft !== null) updateAttributes({ author: authorDraft });
            }}
            onMouseDown={(e) => e.stopPropagation()}
            placeholder={lang === 'zh' ? '作者' : 'Author'}
            className="w-28 border-b border-dashed border-slate-300 bg-transparent text-xs text-slate-500 focus:border-slate-500 focus:outline-none"
          />
          <input
            type="text"
            value={source}
            onChange={(e) => setSourceDraft(e.target.value)}
            onBlur={() => {
              if (sourceDraft !== null) updateAttributes({ source: sourceDraft });
            }}
            onMouseDown={(e) => e.stopPropagation()}
            placeholder={lang === 'zh' ? '書籍／出處' : 'Book / source'}
            className="w-36 border-b border-dashed border-slate-300 bg-transparent text-xs text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        </div>
      ) : (
        hasAttribution && (
          <p className="mt-1.5 text-right text-xs not-italic text-slate-400">
            —— {node.attrs.author as string}
            {node.attrs.author && node.attrs.source ? '．' : ''}
            {node.attrs.source ? quotedSource(node.attrs.source as string) : ''}
          </p>
        )
      )}
    </NodeViewWrapper>
  );
};

export const ArticleBlockquote = Blockquote.extend<ArticleBlockquoteOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      lang: 'zh',
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      author: { default: '' },
      source: { default: '' },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ArticleBlockquoteView);
  },
});
