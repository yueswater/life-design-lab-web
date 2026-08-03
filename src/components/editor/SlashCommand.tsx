import { Extension } from '@tiptap/core';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { Heading2, Heading3, Heading4, List, ListOrdered, Quote, Image as ImageIcon } from 'lucide-react';
import { SlashCommandList, SlashCommandListRef, SlashCommandItem } from './SlashCommandList';
import type { Editor, Range } from '@tiptap/core';

function getItems(lang: 'zh' | 'en'): SlashCommandItem[] {
  return [
    {
      title: 'H2',
      description: lang === 'zh' ? '中標題' : 'Medium heading',
      icon: Heading2,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
    },
    {
      title: 'H3',
      description: lang === 'zh' ? '小標題' : 'Small heading',
      icon: Heading3,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
    },
    {
      title: 'H4',
      description: lang === 'zh' ? '次小標題' : 'Smaller heading',
      icon: Heading4,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run(),
    },
    {
      title: lang === 'zh' ? '無序列點' : 'Bullet list',
      description: lang === 'zh' ? '項目符號清單' : 'A simple bulleted list',
      icon: List,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
      title: lang === 'zh' ? '有序列點' : 'Numbered list',
      description: lang === 'zh' ? '數字編號清單' : 'A numbered list',
      icon: ListOrdered,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
      title: lang === 'zh' ? '引言' : 'Quote',
      description: lang === 'zh' ? '引用區塊，可加作者與書籍' : 'A quote block, with author and book',
      icon: Quote,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    },
    {
      title: lang === 'zh' ? '插入圖片' : 'Image',
      description: lang === 'zh' ? '開啟檔案選擇器上傳圖片' : 'Open the file picker to upload an image',
      icon: ImageIcon,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        editor.view.dom.dispatchEvent(new CustomEvent('article-editor:request-image', { bubbles: true }));
      },
    },
  ];
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

export const SlashCommand = Extension.create<{ lang: 'zh' | 'en' }>({
  name: 'slashCommand',

  addOptions() {
    return { lang: 'zh' };
  },

  addProseMirrorPlugins() {
    const lang = this.options.lang;
    const suggestion: Omit<SuggestionOptions, 'editor'> = {
      char: '/',
      startOfLine: false,
      items: ({ query }) =>
        getItems(lang).filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
      command: ({ editor, range, props }) => {
        (props as SlashCommandItem).command({ editor, range });
      },
      render: () => {
        let component: ReactRenderer<SlashCommandListRef>;
        let popup: TippyInstance[];

        return {
          onStart: (props) => {
            component = new ReactRenderer(SlashCommandList, {
              props,
              editor: props.editor,
            });
            if (!props.clientRect) return;
            popup = tippy('body', {
              getReferenceClientRect: props.clientRect as () => DOMRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
              theme: 'slash-command',
              arrow: false,
            });
          },
          onUpdate: (props) => {
            component.updateProps(props);
            if (!props.clientRect) return;
            popup[0]?.setProps({ getReferenceClientRect: props.clientRect as () => DOMRect });
          },
          onKeyDown: (props) => {
            if (props.event.key === 'Escape') {
              popup[0]?.hide();
              return true;
            }
            return component.ref?.onKeyDown(props) ?? false;
          },
          onExit: () => {
            popup[0]?.destroy();
            component.destroy();
          },
        };
      },
    };

    return [Suggestion({ editor: this.editor, ...suggestion })];
  },
});
