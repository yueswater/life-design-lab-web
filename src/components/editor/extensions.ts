import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { ArticleImage } from './ArticleImage';
import { ArticleBlockquote } from './ArticleBlockquote';
import { SlashCommand } from './SlashCommand';

// Shared between the live editor and the read-only renderer (preview pane +
// public article page) so both interpret the same document identically.
// `slashCommand` is only meaningful for the live (editable) instance, so the
// read-only renderer simply omits the placeholder/slash args.
export function getArticleExtensions(lang: 'zh' | 'en', placeholder?: string, enableSlashCommand = false) {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
      // Replaced by ArticleBlockquote below, which adds author/source
      // attribution attrs + a NodeView on top of the same node.
      blockquote: false,
    }),
    TextStyle,
    Color,
    Underline,
    ArticleImage.configure({ lang }),
    ArticleBlockquote.configure({ lang }),
    ...(placeholder ? [Placeholder.configure({ placeholder })] : []),
    ...(enableSlashCommand ? [SlashCommand.configure({ lang })] : []),
  ];
}
