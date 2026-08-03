import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Newspaper } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../i18n/LanguageContext';
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

// Renders nothing if there are no published articles yet, so an empty blog
// never leaves a hollow section sitting on the homepage.
export const LatestArticlesSection = () => {
  const { lang } = useLanguage();
  const [articles, setArticles] = useState<ArticleSummary[] | null>(null);

  useEffect(() => {
    fetchLatestArticles(3)
      .then(setArticles)
      .catch(() => setArticles([]));
  }, []);

  if (articles && articles.length === 0) return null;

  return (
    <section className="w-full px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#023047]/60">
              {lang === 'zh' ? '生命設計筆記' : 'Notes on Life Design'}
            </p>
            <h2 className="font-huninn text-3xl font-black leading-tight tracking-tight text-[#023047] sm:text-4xl">
              {lang === 'zh' ? '最新' : 'Latest '}
              <span className="text-[#FBD634]">{lang === 'zh' ? '專欄文章' : 'Articles'}</span>
            </h2>
          </div>
          <Link
            to="/articles"
            className="flex items-center gap-1.5 text-sm font-bold text-[#023047] hover:opacity-70"
          >
            {lang === 'zh' ? '查看全部' : 'View all'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {!articles && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        )}

        {articles && articles.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                  <h3 className="font-huninn text-sm font-black text-[#023047] group-hover:opacity-70">
                    {lang === 'zh' ? article.titleZh : article.titleEn}
                  </h3>
                  <p className="mt-1.5 flex-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {lang === 'zh' ? article.descriptionZh : article.descriptionEn}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{formatDate(article.publishedAt, lang)}</span>
                    <span className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {article.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faShare} className="h-3.5 w-3.5" />
                        {article.shareCount}
                      </span>
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
};
