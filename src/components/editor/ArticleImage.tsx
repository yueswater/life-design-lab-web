import React from 'react';
import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

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
  const { node, updateAttributes, editor } = props;
  const lang = (editor.extensionManager.extensions.find((e) => e.name === 'articleImage')?.options
    .lang ?? 'zh') as 'zh' | 'en';
  const prefix = lang === 'zh' ? '圖' : 'Figure';
  const number = figureNumber(props);

  return (
    <NodeViewWrapper as="figure" className="my-4">
      <img
        src={node.attrs.src}
        alt={node.attrs.alt ?? ''}
        className="mx-auto max-h-[480px] rounded-xl object-contain"
      />
      <figcaption className="mt-2 text-center text-xs font-medium text-slate-500">
        <span className="font-semibold text-slate-600">
          {prefix} {number}
        </span>
        {editor.isEditable ? (
          <input
            type="text"
            value={node.attrs.caption ?? ''}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder={lang === 'zh' ? '輸入圖說…' : 'Enter a caption…'}
            className="ml-1.5 w-56 border-b border-dashed border-slate-300 bg-transparent text-center text-xs text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        ) : (
          node.attrs.caption && <span>：{node.attrs.caption}</span>
        )}
      </figcaption>
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
