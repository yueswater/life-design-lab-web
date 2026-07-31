import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Italic, Strikethrough, Palette } from 'lucide-react';

interface EditorBubbleMenuProps {
  editor: Editor;
}

const PRESET_COLORS = ['#023047', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

const btnClass = (active: boolean) =>
  `flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${
    active ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
  }`;

export const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({ editor }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const currentColor = editor.getAttributes('textStyle').color as string | undefined;

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: e, state }) => e.isFocused && !state.selection.empty}
      options={{ placement: 'top', offset: 8 }}
    >
      <div className="relative flex items-center gap-0.5 rounded-lg bg-[#023047] px-1.5 py-1 shadow-lg">
        <button
          type="button"
          title="粗體"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="斜體"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="刪除線"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnClass(editor.isActive('strike'))}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </button>

        <span className="mx-0.5 h-4 w-px bg-white/20" />

        <button
          type="button"
          title="文字顏色"
          onClick={() => setPickerOpen((o) => !o)}
          className={btnClass(pickerOpen || !!currentColor)}
        >
          <Palette className="h-3.5 w-3.5" style={currentColor ? { color: currentColor } : undefined} />
        </button>

        {pickerOpen && (
          <div className="absolute left-0 top-full z-10 mt-1.5 w-48 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xl">
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setPickerOpen(false);
                  }}
                  style={{ backgroundColor: color }}
                  className="h-5 w-5 cursor-pointer rounded-full ring-1 ring-black/10"
                />
              ))}
              <button
                type="button"
                title="清除顏色"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setPickerOpen(false);
                }}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[10px] font-bold text-slate-400 ring-1 ring-black/10"
              >
                ×
              </button>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <input
                type="color"
                value={currentColor ?? '#023047'}
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                className="h-6 w-6 cursor-pointer rounded border border-slate-200 p-0"
              />
              <input
                type="text"
                defaultValue={currentColor ?? ''}
                placeholder="#023047"
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)) {
                    editor.chain().focus().setColor(value).run();
                    setPickerOpen(false);
                  }
                }}
                className="h-6 flex-1 rounded border border-slate-200 px-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#023047]"
              />
            </div>
          </div>
        )}
      </div>
    </BubbleMenu>
  );
};
