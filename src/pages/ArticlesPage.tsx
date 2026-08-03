import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, Newspaper, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';
import { fetchLatestArticles } from '../lib/articles-api';
import { ArticleSummary } from '../types';

function formatDate(iso: string | null, lang: 'zh' | 'en'): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ArticlesPage() {
  const { lang } = useLanguage();
  const t = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTag = searchParams.get('tag');
  const [articles, setArticles] = useState<ArticleSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = `${t.nav.articles} | ${t.footer.brandName}`;
  }, [t.nav.articles, t.footer.brandName]);

  useEffect(() => {
    fetchLatestArticles(50)
      .then(setArticles)
      .catch(() => setError(true));
  }, []);

  const tagCounts = new Map<string, number>();
  for (const article of articles ?? []) {
    for (const tag of article.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const displayedArticles = activeTag ? (articles ?? []).filter((a) => a.tags.includes(activeTag)) : articles;

  const goToTag = (tag: string) => navigate(`/articles?tag=${encodeURIComponent(tag)}`);

  return (
    <section className="w-full px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-[#023047]/50">
          {lang === 'zh' ? '生命設計筆記' : 'Notes on Life Design'}
        </p>
        <h1 className="font-huninn text-3xl font-black tracking-tight text-[#023047] sm:text-4xl">
          {t.nav.articles}
        </h1>

        {activeTag && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <span>{lang === 'zh' ? '篩選標籤：' : 'Filtered by:'}</span>
            <span className="flex items-center gap-1 rounded-full bg-[#FBD634] py-1 pl-3 pr-1.5 text-xs font-bold text-[#023047]">
              {activeTag}
              <Link
                to="/articles"
                aria-label={lang === 'zh' ? '清除篩選' : 'Clear filter'}
                className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-[#023047]/10"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
          </div>
        )}

        {error && (
          <p className="mt-10 text-sm font-medium text-slate-400">
            {lang === 'zh' ? '無法載入文章，請稍後再試。' : 'Could not load articles. Please try again.'}
          </p>
        )}

        {!articles && !error && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        )}

        {displayedArticles && displayedArticles.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center text-slate-400">
            <Newspaper className="h-8 w-8" />
            <p className="text-sm font-semibold">
              {activeTag
                ? lang === 'zh'
                  ? '沒有符合此標籤的文章。'
                  : 'No articles match this tag.'
                : lang === 'zh'
                  ? '文章即將上線，敬請期待。'
                  : 'Articles are coming soon.'}
            </p>
          </div>
        )}

        {displayedArticles && displayedArticles.length > 0 && (
          <div className="mt-10 lg:grid lg:grid-cols-[1fr_260px] lg:items-start lg:gap-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#023047]/5"
                >
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt=""
                      className="h-full w-full object-cover grayscale-0 transition-all duration-500 group-hover:scale-105 group-hover:grayscale"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#023047]/30">
                      <Newspaper className="h-6 w-6" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-12">
                    {article.tags.length > 0 && (
                      <div className="mb-1.5 flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              goToTag(tag);
                            }}
                            className="cursor-pointer rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-[#FBD634] hover:text-[#023047]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-huninn text-sm font-black text-white line-clamp-2">
                      {lang === 'zh' ? article.titleZh : article.titleEn}
                    </h2>
                    <p className="line-clamp-2 max-h-0 overflow-hidden text-xs leading-relaxed text-white/80 opacity-0 transition-all duration-300 group-hover:mt-1.5 group-hover:max-h-10 group-hover:opacity-100">
                      {lang === 'zh' ? article.descriptionZh : article.descriptionEn}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-white/70">
                      <span>{formatDate(article.publishedAt, lang)}</span>
                      <span className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faShare} className="h-3 w-3" />
                          {article.shareCount}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {topTags.length > 0 && (
              <aside className="mt-10 lg:mt-0">
                <div className="rounded-2xl bg-white px-5 pb-5 lg:sticky lg:top-24">
                  <h2 className="font-huninn text-xl font-black text-[#023047]">
                    {lang === 'zh' ? '熱門標籤' : 'Popular Tags'}
                  </h2>
                  <ul className="mt-3 space-y-1">
                    {topTags.map(([tag, count]) => (
                      <li key={tag}>
                        <Link
                          to={activeTag === tag ? '/articles' : `/articles?tag=${encodeURIComponent(tag)}`}
                          className={`-mx-2 flex items-center justify-between rounded-lg px-2 py-1.5 text-base transition-colors hover:bg-[#FBD634] hover:text-[#023047] ${
                            activeTag === tag ? 'bg-[#FBD634] text-[#023047]' : 'text-slate-500'
                          }`}
                        >
                          <span>{tag}</span>
                          <span className={activeTag === tag ? 'text-[#023047]/70' : 'text-slate-400'}>{count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
