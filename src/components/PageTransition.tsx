import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { formatSource, pickRandomQuote, Quote } from '../lib/quotes';

const VISIBLE_DURATION_MS = 2000;

// Mirrors the top-level paths registered in App.tsx — anything else resolves
// to the 404 page, which shouldn't get the plane/quote moment.
const KNOWN_PATHS = new Set(['', 'about', 'book', 'terms', 'privacy', 'admin', 'admin/login']);

function isKnownRoute(pathname: string): boolean {
  return KNOWN_PATHS.has(pathname.replace(/^\/|\/$/g, ''));
}

// Plays a paper-plane + life-design-quote moment, centered on screen over a
// blurred backdrop, every time the route changes — and once on first load,
// which also covers a hard refresh since that remounts the whole app.
export const PageTransition: React.FC = () => {
  const location = useLocation();
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState<{ quote: Quote; index: number }>(() => pickRandomQuote());
  const lastIndex = useRef<number | undefined>(current.index);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!isKnownRoute(location.pathname)) {
      isFirstRun.current = false;
      setVisible(false);
      return;
    }

    if (!isFirstRun.current) {
      const next = pickRandomQuote(lastIndex.current);
      lastIndex.current = next.index;
      setCurrent(next);
    }
    isFirstRun.current = false;

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), VISIBLE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!visible) return null;

  const { quote, author } = current.quote;
  const { text: sourceText, isBookTitle } = formatSource(current.quote, lang);
  const key = `${location.pathname}-${current.index}`;

  return (
    <div className="page-transition-overlay fixed inset-0 z-[70] flex flex-col items-center justify-center bg-white/25 backdrop-blur-2xl">
      <span key={`plane-${key}`} className="page-transition-plane-enter relative inline-flex">
        <img src="/logo-yellow.svg" alt="" aria-hidden="true" className="w-16 sm:w-20" />
      </span>

      <figure key={`quote-${key}`} className="page-transition-quote mt-8 w-full max-w-md px-6">
        <blockquote className="font-huninn text-balance text-center text-base font-bold leading-relaxed text-[#023047] sm:text-lg">
          {lang === 'zh' ? `「${quote.zh}」` : `"${quote.en}"`}
        </blockquote>
        <figcaption className="mt-3 text-center text-xs font-semibold text-[#023047]/60 sm:text-sm">
          {author[lang]}
          <span className="mx-1.5 text-[#023047]/30">—</span>
          <em className={isBookTitle && lang === 'en' ? 'italic' : 'not-italic'}>{sourceText}</em>
        </figcaption>
      </figure>
    </div>
  );
};
