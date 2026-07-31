import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';
import { fetchArticleBySlug, recordArticleView } from '../lib/articles-api';
import { hasAnalyticsConsent } from '../lib/cookieConsent';
import { ArticleDetail } from '../types';
import { ArticleReadOnly } from '../components/editor/ArticleReadOnly';

function formatDate(iso: string | null, lang: 'zh' | 'en'): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = useTranslation();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setArticle(null);
    setNotFound(false);
    fetchArticleBySlug(slug)
      .then(setArticle)
      .catch((err) => {
        if (err instanceof Error && err.message === 'NOT_FOUND') {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
      });
    if (hasAnalyticsConsent()) {
      recordArticleView(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (article) {
      document.title = `${lang === 'zh' ? article.titleZh : article.titleEn} | ${t.footer.brandName}`;
    }
  }, [article, lang, t.footer.brandName]);

  useEffect(() => {
    if (notFound) navigate('/articles', { replace: true });
  }, [notFound, navigate]);

  if (!article) {
    return (
      <div className="flex items-center gap-2 px-4 py-32 text-slate-400 sm:px-8">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-semibold">載入中...</span>
      </div>
    );
  }

  return (
    <article className="w-full px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/articles"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#023047]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.nav.articles}
        </Link>

        <h1 className="mt-6 font-huninn text-3xl font-black tracking-tight text-[#023047] sm:text-4xl">
          {lang === 'zh' ? article.titleZh : article.titleEn}
        </h1>

        <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span>{formatDate(article.publishedAt, lang)}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {article.viewCount}
          </span>
        </div>

        <div className="mt-8">
          <ArticleReadOnly lang={lang} content={lang === 'zh' ? article.contentZh : article.contentEn} />
        </div>
      </div>
    </article>
  );
}
