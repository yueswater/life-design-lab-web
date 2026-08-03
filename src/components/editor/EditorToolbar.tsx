import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Heading2, Heading3, Heading4, List, ListOrdered, Quote, Image as ImageIcon, Loader2 } from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
  onUploadImage: (file: File) => void | Promise<void>;
  uploading: boolean;
}

export interface EditorToolbarRef {
  openFilePicker: () => void;
}

const btnClass = (active: boolean) =>
  `flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
    active ? 'bg-[#023047] text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-[#023047]'
  }`;

export const EditorToolbar = forwardRef<EditorToolbarRef, EditorToolbarProps>(
  ({ editor, onUploadImage, uploading }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      openFilePicker: () => fileInputRef.current?.click(),
    }));

    return (
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/60 px-2 py-1.5">
        <button
          type="button"
          title="H2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="H3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive('heading', { level: 3 }))}
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="H4"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={btnClass(editor.isActive('heading', { level: 4 }))}
        >
          <Heading4 className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <button
          type="button"
          title="無序列點"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="有序列點"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="引言"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
        >
          <Quote className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <button
          type="button"
          title="插入圖片"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={`${btnClass(false)} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) await onUploadImage(file);
          }}
        />
      </div>
    );
  }
);

EditorToolbar.displayName = 'EditorToolbar';
