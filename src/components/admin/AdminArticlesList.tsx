import { useEffect, useState } from 'react';
import { AlertCircle, Archive, FileEdit, Loader2, Pencil, Plus, Send } from 'lucide-react';
import { AdminArticle, ArticleStatus } from '../../types';
import { archiveAdminArticle, createAdminArticle, fetchAdminArticles, updateAdminArticle } from '../../lib/articles-api';

const STATUS_LABEL: Record<AdminArticle['status'], string> = {
  draft: '草稿',
  published: '已發布',
  archived: '已歸檔',
};

const STATUS_STYLE: Record<AdminArticle['status'], string> = {
  draft: 'bg-amber-50 text-amber-700',
  published: 'bg-emerald-50 text-emerald-700',
  archived: 'bg-slate-100 text-slate-500',
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

interface AdminArticlesListProps {
  onOpenArticle: (id: string) => void;
}

export const AdminArticlesList = ({ onOpenArticle }: AdminArticlesListProps) => {
  const [articles, setArticles] = useState<AdminArticle[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [statusBusyId, setStatusBusyId] = useState<string | null>(null);

  const load = () => {
    setError(null);
    fetchAdminArticles()
      .then(setArticles)
      .catch((err) => setError(err instanceof Error ? err.message : '無法載入文章，請稍後再試。'));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const article = await createAdminArticle(newTitle.trim());
      setShowCreateModal(false);
      setNewTitle('');
      onOpenArticle(article.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立文章失敗，請稍後再試。');
    } finally {
      setCreating(false);
    }
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;
    const id = archiveTarget;
    setArchiveTarget(null);
    setArchivingId(id);
    try {
      await archiveAdminArticle(id);
      setArticles((prev) => (prev ? prev.map((a) => (a.id === id ? { ...a, status: 'archived' } : a)) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : '封存文章失敗，請稍後再試。');
    } finally {
      setArchivingId(null);
    }
  };

  const handleSetStatus = async (id: string, status: ArticleStatus) => {
    setStatusBusyId(id);
    try {
      await updateAdminArticle(id, { status });
      setArticles((prev) => (prev ? prev.map((a) => (a.id === id ? { ...a, status } : a)) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新狀態失敗，請稍後再試。');
    } finally {
      setStatusBusyId(null);
    }
  };

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-huninn text-2xl font-black text-[#023047]">文章管理</h1>
            {articles && <p className="mt-1 text-sm text-slate-500">共 {articles.length} 篇文章</p>}
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#023047] px-4 py-2 text-sm font-bold text-white hover:brightness-110 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            新增文章
          </button>
        </div>

        {error && (
          <p className="mt-6 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        {!articles && !error && (
          <div className="flex items-center gap-2 py-16 text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-semibold">載入中...</span>
          </div>
        )}

        {articles && articles.length === 0 && (
          <p className="mt-10 text-sm font-medium text-slate-400">目前還沒有文章。</p>
        )}

        {articles && articles.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="py-3 pr-4 font-bold">標題</th>
                  <th className="py-3 pr-4 font-bold">狀態</th>
                  <th className="py-3 pr-4 font-bold">觀看數</th>
                  <th className="py-3 pr-4 font-bold">分享數</th>
                  <th className="py-3 pr-4 font-bold">建立時間</th>
                  <th className="py-3 font-bold">操作</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 align-top">
                    <td className="py-3.5 pr-4">
                      <button
                        type="button"
                        onClick={() => onOpenArticle(a.id)}
                        className="font-semibold text-[#023047] hover:underline cursor-pointer"
                      >
                        {a.titleZh}
                      </button>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[a.status]}`}
                      >
                        {STATUS_LABEL[a.status]}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-700">{a.viewCount}</td>
                    <td className="py-3.5 pr-4 text-slate-700">{a.shareCount}</td>
                    <td className="py-3.5 pr-4 whitespace-nowrap text-xs text-slate-400">
                      {formatDateTime(a.createdAt)}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1">
                        {(statusBusyId === a.id || archivingId === a.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenArticle(a.id)}
                              title="編輯"
                              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#023047] cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {a.status !== 'draft' && (
                              <button
                                type="button"
                                onClick={() => handleSetStatus(a.id, 'draft')}
                                title="設為草稿"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-amber-600 hover:bg-amber-50 cursor-pointer"
                              >
                                <FileEdit className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {a.status !== 'published' && (
                              <button
                                type="button"
                                onClick={() => handleSetStatus(a.id, 'published')}
                                title="發布"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                              >
                                <Send className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {a.status !== 'archived' && (
                              <button
                                type="button"
                                onClick={() => setArchiveTarget(a.id)}
                                title="歸檔"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-50 cursor-pointer"
                              >
                                <Archive className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-[#023047]">新增文章</h2>
            <label className="mt-4 block text-xs font-semibold text-slate-700 mb-1.5">
              文章標題（中文）
            </label>
            <input
              autoFocus
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleCreate();
              }}
              placeholder="例如：如何用生命設計找到職涯方向"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
            />
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTitle('');
                }}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating || !newTitle.trim()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#FBD634] py-2.5 text-sm font-bold text-[#023047] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                建立並編輯
              </button>
            </div>
          </div>
        </div>
      )}

      {archiveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-[#023047]">歸檔文章</h2>
            <p className="mt-2 text-sm text-slate-500">確定要將這篇文章歸檔嗎？歸檔後不會顯示在網站上。</p>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setArchiveTarget(null)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmArchive}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 cursor-pointer"
              >
                確認歸檔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
