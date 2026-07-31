import { AdminArticle, ArticleDetail, ArticleStatus, ArticleSummary, TiptapDoc } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function parseError(response: Response, fallback: string): Promise<string> {
  const body = await response.json().catch(() => ({}));
  return typeof body?.error === 'string' ? body.error : fallback;
}

export async function fetchLatestArticles(limit: number): Promise<ArticleSummary[]> {
  const response = await fetch(`${API_BASE_URL}/api/articles?limit=${limit}`);
  if (!response.ok) throw new Error(await parseError(response, '無法載入文章，請稍後再試。'));
  return response.json();
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail> {
  const response = await fetch(`${API_BASE_URL}/api/articles/${encodeURIComponent(slug)}`);
  if (response.status === 404) throw new Error('NOT_FOUND');
  if (!response.ok) throw new Error(await parseError(response, '無法載入文章，請稍後再試。'));
  return response.json();
}

export async function recordArticleView(slug: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/articles/${encodeURIComponent(slug)}/view`, { method: 'POST' }).catch(
    () => {}
  );
}

export async function fetchAdminArticles(): Promise<AdminArticle[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/articles`, { credentials: 'include' });
  if (response.status === 401) throw new Error('UNAUTHORIZED');
  if (!response.ok) throw new Error(await parseError(response, '無法載入文章，請稍後再試。'));
  return response.json();
}

export async function fetchAdminArticle(id: string): Promise<AdminArticle> {
  const response = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, { credentials: 'include' });
  if (response.status === 401) throw new Error('UNAUTHORIZED');
  if (!response.ok) throw new Error(await parseError(response, '無法載入文章，請稍後再試。'));
  return response.json();
}

export async function createAdminArticle(titleZh: string): Promise<AdminArticle> {
  const response = await fetch(`${API_BASE_URL}/api/admin/articles`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titleZh, titleEn: titleZh }),
  });
  if (!response.ok) throw new Error(await parseError(response, '建立文章失敗，請稍後再試。'));
  return response.json();
}

export interface UpdateArticleInput {
  titleZh?: string;
  titleEn?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  contentZh?: TiptapDoc;
  contentEn?: TiptapDoc;
  coverImageUrl?: string;
  status?: ArticleStatus;
}

export async function updateAdminArticle(id: string, input: UpdateArticleInput): Promise<AdminArticle> {
  const response = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(await parseError(response, '更新文章失敗，請稍後再試。'));
  return response.json();
}

export async function archiveAdminArticle(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await parseError(response, '封存文章失敗，請稍後再試。'));
}

export async function uploadArticleImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_BASE_URL}/api/admin/articles/upload-image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!response.ok) throw new Error(await parseError(response, '圖片上傳失敗，請稍後再試。'));
  const body = await response.json();
  return body.url as string;
}
