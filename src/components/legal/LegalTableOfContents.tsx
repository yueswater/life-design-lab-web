import React, { useEffect, useState } from 'react';
import type { LegalChapter } from '../../lib/legal/table-of-contents';

interface LegalTableOfContentsProps {
  label: string;
  chapters: LegalChapter[];
}

// Scans the given ids top-to-bottom and returns the last one that has
// scrolled past the activation line — i.e. "how far down have we read".
function lastHeadingPast(ids: string[], threshold: number): string {
  let result = '';
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= threshold) result = id;
    else break;
  }
  return result;
}

function useActiveLegalHeadings(chapters: LegalChapter[]) {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id ?? '');
  const [activeArticleId, setActiveArticleId] = useState('');
  const [activeClauseId, setActiveClauseId] = useState('');

  useEffect(() => {
    const chapterIds = chapters.map((c) => c.id);
    const articleIds = chapters.flatMap((c) => c.articles.map((a) => a.id));
    const clauseIds = chapters.flatMap((c) => c.articles.flatMap((a) => a.clauses.map((cl) => cl.id)));

    const update = () => {
      const nextChapterId = lastHeadingPast(chapterIds, 160);
      if (nextChapterId) setActiveChapterId(nextChapterId);
      setActiveArticleId(lastHeadingPast(articleIds, 160));
      setActiveClauseId(lastHeadingPast(clauseIds, 160));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [chapters]);

  return { activeChapterId, setActiveChapterId, activeArticleId, activeClauseId } as const;
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
}

function TocLinks({
  chapters,
  activeChapterId,
  activeArticleId,
  activeClauseId,
  onNavigate,
}: {
  chapters: LegalChapter[];
  activeChapterId: string;
  activeArticleId: string;
  activeClauseId: string;
  onNavigate: (id: string, chapterId: string) => void;
}) {
  return (
    <ol className="space-y-1 border-l border-slate-200 text-sm">
      {chapters.map((chapter) => {
        const expanded = chapter.id === activeChapterId;
        return (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-current={expanded ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(chapter.id, chapter.id);
              }}
              className={`-ml-px block cursor-pointer border-l px-3 py-1.5 leading-5 transition-colors ${
                expanded
                  ? 'border-[#023047] font-bold text-[#023047]'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {chapter.title}
            </a>

            {expanded && chapter.articles.length > 0 && (
              <ol className="mt-1 space-y-1 border-l border-slate-100 pl-3 text-xs text-slate-500">
                {chapter.articles.map((article) => {
                  const articleActive = article.id === activeArticleId;
                  return (
                    <li key={article.id}>
                      <a
                        href={`#${article.id}`}
                        aria-current={articleActive ? 'location' : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(article.id, chapter.id);
                        }}
                        className={`block cursor-pointer rounded-md px-2 py-1 leading-5 transition-colors hover:text-[#023047] ${
                          articleActive ? 'bg-[#FBD634]/25 font-bold text-[#023047]' : ''
                        }`}
                      >
                        {article.title}
                      </a>
                      {article.clauses.length > 0 && (
                        <ol className="space-y-0.5 border-l border-slate-100 pl-3 text-slate-400">
                          {article.clauses.map((clause) => {
                            const clauseActive = clause.id === activeClauseId;
                            return (
                              <li key={clause.id}>
                                <a
                                  href={`#${clause.id}`}
                                  aria-current={clauseActive ? 'location' : undefined}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate(clause.id, chapter.id);
                                  }}
                                  className={`block cursor-pointer py-0.5 leading-5 hover:text-[#023047] ${
                                    clauseActive ? 'font-bold text-[#023047]' : ''
                                  }`}
                                >
                                  {clause.title}
                                </a>
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// Reveals the current chapter's articles/clauses on scroll while keeping
// every other chapter collapsed to just its title.
export const LegalTableOfContents: React.FC<LegalTableOfContentsProps> = ({ label, chapters }) => {
  const { activeChapterId, setActiveChapterId, activeArticleId, activeClauseId } =
    useActiveLegalHeadings(chapters);

  if (chapters.length === 0) return null;

  const navigate = (id: string, chapterId: string) => {
    setActiveChapterId(chapterId);
    scrollToHeading(id);
  };

  return (
    <>
      <aside className="hidden lg:sticky lg:top-28 lg:block lg:h-fit lg:self-start">
        <nav aria-label={label}>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <TocLinks
            chapters={chapters}
            activeChapterId={activeChapterId}
            activeArticleId={activeArticleId}
            activeClauseId={activeClauseId}
            onNavigate={navigate}
          />
        </nav>
      </aside>

      <details className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:hidden">
        <summary className="cursor-pointer text-sm font-bold text-[#023047]">{label}</summary>
        <nav aria-label={label} className="mt-3">
          <TocLinks
            chapters={chapters}
            activeChapterId={activeChapterId}
            activeArticleId={activeArticleId}
            activeClauseId={activeClauseId}
            onNavigate={navigate}
          />
        </nav>
      </details>
    </>
  );
};
