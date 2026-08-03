import type { VercelRequest, VercelResponse } from '@vercel/node';

// public/sitemap.xml used to be a hand-written static file that never
// listed articles and never grew as new ones got published. Generating it
// here on every request (Vercel edge-caches the response) keeps it in sync
// with whatever's actually published in the database.
const SITE_URL = 'https://www.life-design-lab.space';
const API_BASE_URL = process.env.VITE_API_URL ?? 'https://api.life-design-lab.space';

interface ArticleSummary {
  slug: string;
  publishedAt: string | null;
}

const STATIC_PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/articles', changefreq: 'weekly', priority: '0.8' },
  { path: '/book', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.2' },
  { path: '/terms', changefreq: 'yearly', priority: '0.2' },
];

function escapeXml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  let articles: ArticleSummary[] = [];
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles?limit=50`);
    if (response.ok) {
      articles = (await response.json()) as ArticleSummary[];
    }
  } catch {
    // Backend unreachable — ship the sitemap with just the static pages below.
  }

  const staticEntries = STATIC_PAGES.map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  );

  const articleEntries = articles.map((article) => {
    const loc = `${SITE_URL}/articles/${encodeURIComponent(article.slug)}`;
    const lastmod = article.publishedAt ? `\n    <lastmod>${article.publishedAt.slice(0, 10)}</lastmod>` : '';
    return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...articleEntries].join('\n')}
</urlset>
`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
