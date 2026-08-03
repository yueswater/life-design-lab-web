import type { VercelRequest, VercelResponse } from '@vercel/node';

// Social crawlers never run our client-side JS, so the SPA's static
// index.html can only ever expose one site-wide og:title/og:image. Guessing
// every crawler's user-agent (Facebook, X, LINE, ...) is a losing game —
// LINE in particular doesn't send a reliably matchable UA, which is why
// shares were showing the homepage's title/image instead of the article's.
// Instead, EVERY request to /articles/:slug (bot or human) is rewritten
// here: we fetch the real, already-built index.html, swap in this
// article's title/description/image, and serve it back unchanged
// otherwise — the same #root + script/style tags, so the real SPA boots
// normally for human visitors too.
//
// Deliberately a flat file (not api/og/articles/[slug].ts) — Vercel wasn't
// resolving that nested dynamic-segment path at all and silently fell back
// to the static index.html for every request. vercel.json forwards the
// slug as a query param instead (?slug=:slug), which works reliably.
const SITE_URL = 'https://www.life-design-lab.space';
const API_BASE_URL = process.env.VITE_API_URL ?? 'https://api.life-design-lab.space';
const DEFAULT_TITLE = '生命設計實驗室 | 設計專屬你的人生劇本';
const DEFAULT_META_DESCRIPTION =
  '生命設計實驗室提供一對一諮詢、小班制課程、實體工作坊與講座，運用設計思考帶你釐清職涯與人生方向，打造屬於自己的人生劇本。';
const DEFAULT_OG_DESCRIPTION =
  '一對一諮詢、小班制課程、實體工作坊與講座，運用設計思考帶你釐清職涯與人生方向，打造屬於自己的人生劇本。';
const DEFAULT_CANONICAL_URL = `${SITE_URL}/`;
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

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
  let description = DEFAULT_OG_DESCRIPTION;
  let image = DEFAULT_IMAGE;
  let pageUrl = DEFAULT_CANONICAL_URL;

  if (slug) {
    pageUrl = `${SITE_URL}/articles/${encodeURIComponent(slug)}`;
    try {
      const articleResponse = await fetch(`${API_BASE_URL}/api/articles/${encodeURIComponent(slug)}`);
      if (articleResponse.ok) {
        const article = (await articleResponse.json()) as ArticleDetail;
        title = `${article.titleZh} | 生命設計實驗室`;
        description = article.descriptionZh || DEFAULT_OG_DESCRIPTION;
        image = article.coverImageUrl || DEFAULT_IMAGE;
      }
    } catch {
      // Backend unreachable — fall back to the site-wide defaults below.
    }
  }

  let html: string;
  try {
    const shellResponse = await fetch(`${SITE_URL}/index.html`);
    html = await shellResponse.text();
  } catch {
    res.status(502).send('failed to load page shell');
    return;
  }

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeMetaDescription = escapeHtml(description === DEFAULT_OG_DESCRIPTION ? DEFAULT_META_DESCRIPTION : description);
  const safeImage = escapeHtml(image);
  const safeUrl = escapeHtml(pageUrl);

  html = html
    .replace(`<title>${DEFAULT_TITLE}</title>`, `<title>${safeTitle}</title>`)
    .replace(`content="${DEFAULT_META_DESCRIPTION}"`, `content="${safeMetaDescription}"`)
    .replace(`href="${DEFAULT_CANONICAL_URL}"`, `href="${safeUrl}"`)
    .replace('property="og:type" content="website"', 'property="og:type" content="article"')
    .replaceAll(`content="${DEFAULT_TITLE}"`, `content="${safeTitle}"`)
    .replaceAll(`content="${DEFAULT_OG_DESCRIPTION}"`, `content="${safeDescription}"`)
    .replace(`content="${DEFAULT_CANONICAL_URL}"`, `content="${safeUrl}"`)
    .replaceAll(`content="${DEFAULT_IMAGE}"`, `content="${safeImage}"`);

  if (image !== DEFAULT_IMAGE) {
    html = html
      .replace(/\s*<meta property="og:image:width"[^>]*>\n?/, '')
      .replace(/\s*<meta property="og:image:height"[^>]*>\n?/, '');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
}
