import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Newspaper } from 'lucide-react';
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

  return (
    <section className="w-full px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-[#023047]/50">
          {lang === 'zh' ? '生命設計筆記' : 'Notes on Life Design'}
        </p>
        <h1 className="font-huninn text-3xl font-black tracking-tight text-[#023047] sm:text-4xl">
          {t.nav.articles}
        </h1>

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

        {articles && articles.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center text-slate-400">
            <Newspaper className="h-8 w-8" />
            <p className="text-sm font-semibold">
              {lang === 'zh' ? '文章即將上線，敬請期待。' : 'Articles are coming soon.'}
            </p>
          </div>
        )}

        {articles && articles.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-[#023047]/30"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-[#023047]/5">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#023047]/30">
                      <Newspaper className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-huninn text-sm font-black text-[#023047] group-hover:opacity-70">
                    {lang === 'zh' ? article.titleZh : article.titleEn}
                  </h2>
                  <p className="mt-1.5 flex-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {lang === 'zh' ? article.descriptionZh : article.descriptionEn}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{formatDate(article.publishedAt, lang)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {article.viewCount}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
