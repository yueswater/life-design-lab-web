import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Link as LinkIcon, Loader2, Share2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLine, faWhatsapp, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';
import { fetchArticleBySlug, recordArticleShare, recordArticleView } from '../lib/articles-api';
import { hasAnalyticsConsent } from '../lib/cookieConsent';
import { ArticleDetail } from '../types';
import { ArticleReadOnly } from '../components/editor/ArticleReadOnly';
import { LayoutContext } from '../components/Layout';

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
  const { setNavLight, showToast } = useOutletContext<LayoutContext>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNavLight(Boolean(article?.coverImageUrl));
    return () => setNavLight(false);
  }, [article, setNavLight]);

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

  // The browser percent-encodes non-ASCII path segments (Chinese slugs) in
  // location.href; decode back to readable text before handing it to share
  // intents so pasted links show Chinese, not %E7%94%9F-style escapes.
  const shareUrl = decodeURIComponent(window.location.href);
  const shareTitle = lang === 'zh' ? article.titleZh : article.titleEn;

  return (
    <article className="w-full">
      {article.coverImageUrl && (
        <div className="-mt-16 h-56 w-full overflow-hidden sm:-mt-[68px] sm:h-72">
          <img
            src={article.coverImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div
        className={`px-4 pb-16 sm:px-8 sm:pb-20 ${
          article.coverImageUrl ? 'pt-8 sm:pt-10' : 'pt-16 sm:pt-20'
        }`}
      >
        <div className="mx-auto max-w-3xl">
          <Link
            to="/articles"
            className="group flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#023047]"
          >
            <ArrowLeft className="h-4 w-4 group-hover:animate-arrow-wiggle" />
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
            <span className="flex items-center gap-1">
              <Share2 className="h-3.5 w-3.5" />
              {article.shareCount}
            </span>
          </div>

          <div className="mt-8">
            <ArticleReadOnly lang={lang} content={lang === 'zh' ? article.contentZh : article.contentEn} />
          </div>

          <div className="mt-16 border-t border-slate-100 pt-10 text-center">
            <p className="font-huninn text-lg font-black text-[#023047]">
              {lang === 'zh' ? '喜歡這篇文章嗎？分享給更多朋友吧！' : 'Enjoyed this article? Share it with others!'}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Line"
                onClick={() => recordArticleShare(article.slug)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06C755] text-white transition-transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faLine} className="h-4.5 w-4.5" />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                onClick={() => recordArticleShare(article.slug)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="h-4.5 w-4.5" />
              </a>
              {/* Instagram share button — no public web share intent exists;
                  Web Share API fallback below was more copy-link-via-toast
                  than a real IG share. Commented out per request pending a
                  better approach. */}
              {/* <button
                type="button"
                onClick={async () => {
                  if (
                    article.coverImageUrl &&
                    typeof navigator.share === 'function' &&
                    typeof navigator.canShare === 'function'
                  ) {
                    try {
                      const imageResponse = await fetch(article.coverImageUrl);
                      const blob = await imageResponse.blob();
                      const file = new File([blob], 'cover.jpg', { type: blob.type || 'image/jpeg' });
                      if (navigator.canShare({ files: [file] })) {
                        try {
                          await navigator.share({ files: [file], title: shareTitle });
                        } catch {
                          // User cancelled the native share sheet — nothing to do.
                        }
                        return;
                      }
                    } catch {
                      // Image fetch/prep failed — fall through to the clipboard copy below.
                    }
                  }
                  navigator.clipboard.writeText(shareUrl);
                  showToast(
                    lang === 'zh'
                      ? '連結已複製，貼到 Instagram 限動或訊息分享吧！'
                      : 'Link copied — paste it into your Instagram story or DM!'
                  );
                }}
                aria-label="Instagram"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-linear-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white transition-transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faInstagram} className="h-4.5 w-4.5" />
              </button> */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
                  shareTitle
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                onClick={() => recordArticleShare(article.slug)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  recordArticleShare(article.slug);
                  showToast(lang === 'zh' ? '連結已複製！' : 'Link copied!');
                }}
                aria-label={lang === 'zh' ? '複製連結' : 'Copy link'}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate-500 text-white transition-transform hover:scale-105"
              >
                <LinkIcon className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
