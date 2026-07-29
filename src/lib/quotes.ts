import quotesData from '../data/lifeDesignQuotes.json';
import { Language } from '../i18n/LanguageContext';

export interface Quote {
  quote: { zh: string; en: string };
  author: { zh: string; en: string };
  source: { zh: string; en: string };
  isBook: boolean;
}

const QUOTES = quotesData as Quote[];

export function pickRandomQuote(excludeIndex?: number): { quote: Quote; index: number } {
  if (QUOTES.length === 1) return { quote: QUOTES[0], index: 0 };
  let index = Math.floor(Math.random() * QUOTES.length);
  while (index === excludeIndex) {
    index = Math.floor(Math.random() * QUOTES.length);
  }
  return { quote: QUOTES[index], index };
}

/**
 * Formats a quote's source per language convention:
 * - English book titles: italicized and wrapped in straight double quotes.
 * - Chinese book titles: wrapped in 《》, no italics.
 * - Non-book sources: shown plainly in both languages.
 */
export function formatSource(quote: Quote, lang: Language): { text: string; isBookTitle: boolean } {
  const source = quote.source[lang];
  if (!quote.isBook) return { text: source, isBookTitle: false };
  if (lang === 'zh') return { text: `《${source}》`, isBookTitle: true };
  return { text: `"${source}"`, isBookTitle: true };
}
