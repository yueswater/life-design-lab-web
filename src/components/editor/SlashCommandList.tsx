import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { Editor, Range } from '@tiptap/core';
import type { LucideIcon } from 'lucide-react';

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: LucideIcon;
  command: (args: { editor: Editor; range: Range }) => void;
}

interface SlashCommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export interface SlashCommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const SlashCommandList = forwardRef<SlashCommandListRef, SlashCommandListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((i) => (i + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-lg">
        沒有符合的指令
      </div>
    );
  }

  return (
    <div className="max-h-72 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
      {props.items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            type="button"
            onClick={() => selectItem(index)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer ${
              index === selectedIndex ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#023047]/5 text-[#023047]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#023047]">{item.title}</span>
              <span className="block truncate text-xs text-slate-400">{item.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
});

SlashCommandList.displayName = 'SlashCommandList';
