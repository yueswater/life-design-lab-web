import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTranslation } from '../../i18n/strings';
import { extractLegalHeadings, extractLegalTableOfContents } from '../../lib/legal/table-of-contents';
import { LegalTableOfContents } from './LegalTableOfContents';

interface LegalPageProps {
  doc: 'terms' | 'privacy';
}

export const LegalPage: React.FC<LegalPageProps> = ({ doc }) => {
  const { lang } = useLanguage();
  const t = useTranslation();
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const label = doc === 'terms' ? t.footer.terms : t.footer.privacy;

  useEffect(() => {
    let cancelled = false;
    setMarkdown(null);
    setError(false);

    fetch(`/data/legal/${doc}/${lang}.md`)
      .then((res) => {
        if (!res.ok) throw new Error('failed to load');
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setMarkdown(text);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [doc, lang]);

  useEffect(() => {
    document.title = `${label} | ${t.footer.brandName}`;
  }, [label, t.footer.brandName]);

  const headings = markdown ? extractLegalHeadings(markdown) : [];
  const chapters = markdown ? extractLegalTableOfContents(markdown) : [];
  let headingCursor = 0;

  return (
    <section className="w-full px-4 py-16 sm:px-8 sm:py-20">
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <LegalTableOfContents label={t.legal.tableOfContents} chapters={chapters} />

        <article className="min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors hover:text-[#023047]"
          >
            <ChevronLeft className="h-4 w-4" />
            {t.legal.backHome}
          </Link>

          <div className="mt-6">
            {!markdown && !error && (
              <div className="flex items-center gap-2 py-16 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-semibold">{t.legal.loading}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 py-16 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">{t.legal.loadError}</span>
              </div>
            )}

            {markdown && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="font-huninn text-4xl font-black tracking-tight text-[#023047] text-balance sm:text-5xl">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      id={headings[headingCursor++]?.id}
                      className="mt-14 scroll-mt-28 text-2xl font-black tracking-tight text-[#023047]"
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      id={headings[headingCursor++]?.id}
                      className="mt-9 scroll-mt-28 text-lg font-bold text-[#023047]"
                    >
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4
                      id={headings[headingCursor++]?.id}
                      className="mt-6 scroll-mt-28 text-base font-bold text-slate-800"
                    >
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mt-3 text-sm leading-7 text-slate-600 first:mt-2 sm:text-[15px]">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-[#023047]">{children}</strong>
                  ),
                  ol: ({ children }) => (
                    <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-sm leading-7 text-slate-600 sm:text-[15px]">
                      {children}
                    </ol>
                  ),
                  ul: ({ children }) => (
                    <ul className="mt-3 list-disc space-y-1.5 pl-6 text-sm leading-7 text-slate-600 sm:text-[15px]">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => <li className="pl-1">{children}</li>,
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="font-semibold text-[#023047] underline decoration-[#FBD634] decoration-2 underline-offset-2 transition-colors hover:bg-[#FBD634] hover:text-[#023047] hover:no-underline"
                    >
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="my-10 border-slate-200" />,
                }}
              >
                {markdown}
              </ReactMarkdown>
            )}
          </div>
        </article>
      </main>
    </section>
  );
};
