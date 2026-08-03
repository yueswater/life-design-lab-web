import type { VercelRequest, VercelResponse } from '@vercel/node';

// Social-media crawlers (facebookexternalhit, Twitterbot, ...) never run our
// client-side JS, so the SPA's index.html can only ever expose one static,
// site-wide og:image/og:title. vercel.json rewrites bot user-agents hitting
// /articles/:slug here instead, so each article can carry its own cover
// image and title in the link preview. Real visitors never reach this route
// — they keep getting the normal SPA via the catch-all rewrite.
const SITE_URL = 'https://life-design-lab.space';
const API_BASE_URL = process.env.VITE_API_URL ?? 'https://api.life-design-lab.space';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_TITLE = '生命設計實驗室 | 設計專屬你的人生劇本';
const DEFAULT_DESCRIPTION =
  '一對一諮詢、小班制課程、實體工作坊與講座，運用設計思考帶你釐清職涯與人生方向，打造屬於自己的人生劇本。';

interface ArticleDetail {
  titleZh: string;
  descriptionZh: string;
  coverImageUrl: string | null;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const rawSlug = req.query.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let image = DEFAULT_IMAGE;
  let pageUrl = SITE_URL;

  if (slug) {
    pageUrl = `${SITE_URL}/articles/${encodeURIComponent(slug)}`;
    try {
      const response = await fetch(`${API_BASE_URL}/api/articles/${encodeURIComponent(slug)}`);
      if (response.ok) {
        const article = (await response.json()) as ArticleDetail;
        title = `${article.titleZh} | 生命設計實驗室`;
        description = article.descriptionZh || DEFAULT_DESCRIPTION;
        image = article.coverImageUrl || DEFAULT_IMAGE;
      }
    } catch {
      // Backend unreachable — fall back to the site-wide defaults below.
    }
  }

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeUrl = escapeHtml(pageUrl);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(`<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="生命設計實驗室 Life Design Lab" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:locale" content="zh_TW" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
    <meta http-equiv="refresh" content="0; url=${safeUrl}" />
  </head>
  <body>
    <a href="${safeUrl}">${safeTitle}</a>
  </body>
</html>`);
}
