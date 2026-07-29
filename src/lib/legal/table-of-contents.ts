// Pure markdown-heading parsing, independent of how the document is rendered.
// Keeping this separate from the React tree guarantees the sidebar TOC and
// the in-page heading anchors always agree on the same ids, in the same order.

export interface LegalHeading {
  id: string;
  title: string;
  level: 2 | 3 | 4;
}

export interface LegalClause {
  id: string;
  title: string;
}

export interface LegalArticle {
  id: string;
  title: string;
  clauses: LegalClause[];
}

export interface LegalChapter {
  id: string;
  title: string;
  articles: LegalArticle[];
}

function slugify(title: string): string {
  const slug = title
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) return 'section';
  return /^\d/.test(slug) ? `section-${slug}` : slug;
}

/**
 * Extracts every `##`/`###`/`####` heading from a markdown document, in
 * document order, skipping anything inside fenced code blocks. Duplicate
 * titles get a numeric suffix so anchors stay unique.
 */
export function extractLegalHeadings(markdown: string): LegalHeading[] {
  const counts = new Map<string, number>();
  const headings: LegalHeading[] = [];
  let fence: '`' | '~' | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0] as '`' | '~';
      fence = fence === marker ? null : (fence ?? marker);
      continue;
    }
    if (fence) continue;

    const heading = line.match(/^\s{0,3}(#{2,4})\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;

    const level = heading[1].length as LegalHeading['level'];
    const title = heading[2].trim();
    const baseId = slugify(title);
    const occurrence = (counts.get(baseId) ?? 0) + 1;
    counts.set(baseId, occurrence);

    headings.push({
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      title,
      level,
    });
  }

  return headings;
}

/** Nests a flat heading list into chapter (`##`) → article (`###`) → clause (`####`). */
export function buildLegalTableOfContents(headings: LegalHeading[]): LegalChapter[] {
  const chapters: LegalChapter[] = [];
  let currentChapter: LegalChapter | undefined;
  let currentArticle: LegalArticle | undefined;

  for (const heading of headings) {
    if (heading.level === 2) {
      currentChapter = { id: heading.id, title: heading.title, articles: [] };
      currentArticle = undefined;
      chapters.push(currentChapter);
      continue;
    }
    if (heading.level === 3 && currentChapter) {
      currentArticle = { id: heading.id, title: heading.title, clauses: [] };
      currentChapter.articles.push(currentArticle);
      continue;
    }
    if (heading.level === 4 && currentArticle) {
      currentArticle.clauses.push({ id: heading.id, title: heading.title });
    }
  }

  return chapters;
}

export function extractLegalTableOfContents(markdown: string): LegalChapter[] {
  return buildLegalTableOfContents(extractLegalHeadings(markdown));
}
