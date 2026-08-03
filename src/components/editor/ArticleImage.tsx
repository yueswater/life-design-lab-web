import React, { useState } from 'react';
import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Trash2 } from 'lucide-react';

// Image with an editable caption, rendered as <figure><img/><figcaption/></figure>.
// The "圖 N" / "Figure N" prefix is computed from the image's position among
// its siblings at render time rather than stored, so reordering images never
// leaves stale numbering behind.
export interface ArticleImageOptions {
  lang: 'zh' | 'en';
}

function figureNumber(props: NodeViewProps): number {
  const pos = typeof props.getPos === 'function' ? props.getPos() : null;
  if (pos === null || pos === undefined) return 1;
  let index = 0;
  let found = 1;
  props.editor.state.doc.descendants((node, nodePos) => {
    if (node.type.name === 'articleImage') {
      index += 1;
      if (nodePos === pos) found = index;
    }
  });
  return found;
}

const ArticleImageView: React.FC<NodeViewProps> = (props) => {
  const { node, updateAttributes, editor, deleteNode } = props;
  const lang = (editor.extensionManager.extensions.find((e) => e.name === 'articleImage')?.options
    .lang ?? 'zh') as 'zh' | 'en';
  const prefix = lang === 'zh' ? '圖' : 'Figure';
  const number = figureNumber(props);
  const [hovered, setHovered] = useState(false);
  // Local draft, only flushed to the document on blur — writing every
  // keystroke straight to updateAttributes() fires a ProseMirror
  // transaction per character, which re-renders this NodeView mid-composition
  // and cuts off IME input (Zhuyin) before a character can finish composing.
  const [captionDraft, setCaptionDraft] = useState<string | null>(null);
  const caption = captionDraft ?? (typeof node.attrs.caption === 'string' ? node.attrs.caption : '');
  const hasSavedCaption = typeof node.attrs.caption === 'string' && node.attrs.caption.trim().length > 0;

  return (
    <NodeViewWrapper
      as="figure"
      className="relative my-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt ?? ''}
        className="mx-auto max-h-[480px] object-contain"
      />
      {editor.isEditable && hovered && (
        <button
          type="button"
          title={lang === 'zh' ? '刪除圖片' : 'Delete image'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={deleteNode}
          contentEditable={false}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-red-600 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      {/* In the published (read-only) view, an image with no caption gets no
          figcaption at all — no dangling "圖 x"/"Figure x" label. In the
          editor it always shows so there's a visible spot to type one. */}
      {(editor.isEditable || hasSavedCaption) && (
        <figcaption
          className="mt-2 text-center text-xs font-medium text-slate-500"
          // Marks this subtree as outside ProseMirror's editable document, so
          // the nested <input> handles its own native IME composition (e.g.
          // Zhuyin) instead of having each keystroke intercepted/committed by
          // ProseMirror before composition finishes.
          contentEditable={false}
        >
          <span className="font-semibold text-slate-600">
            {prefix} {number}
          </span>
          {editor.isEditable ? (
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaptionDraft(e.target.value)}
              onBlur={() => {
                if (captionDraft !== null) updateAttributes({ caption: captionDraft });
              }}
              placeholder={lang === 'zh' ? '輸入圖說…' : 'Enter a caption…'}
              // Without this, ProseMirror's own mousedown handling grabs the
              // click before the input actually receives DOM focus, so IME
              // composition (e.g. Zhuyin) never starts on it properly.
              onMouseDown={(e) => e.stopPropagation()}
              className="ml-1.5 w-56 border-b border-dashed border-slate-300 bg-transparent text-center text-xs text-slate-500 focus:border-slate-500 focus:outline-none"
            />
          ) : (
            <span>：{node.attrs.caption}</span>
          )}
        </figcaption>
      )}
    </NodeViewWrapper>
  );
};

export const ArticleImage = Image.extend<ArticleImageOptions>({
  name: 'articleImage',

  addOptions() {
    return {
      ...this.parent?.(),
      lang: 'zh',
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: '',
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ArticleImageView);
  },
});
