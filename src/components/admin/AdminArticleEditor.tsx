import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Columns2,
  Eye,
  ImagePlus,
  Loader2,
  PenLine,
} from 'lucide-react';
import { AdminArticle, ArticleStatus, TiptapDoc } from '../../types';
import { fetchAdminArticle, updateAdminArticle, uploadArticleImage } from '../../lib/articles-api';
import { ArticleEditor } from '../editor/ArticleEditor';
import { ArticleReadOnly } from '../editor/ArticleReadOnly';
import { ImageCropModal } from '../editor/ImageCropModal';

type ViewMode = 'edit' | 'split' | 'preview';
type SaveState = 'saved' | 'saving' | 'unsaved' | 'error';

const AUTOSAVE_INTERVAL_MS = 30000;

const VIEW_MODE_OPTIONS: { value: ViewMode; label: string; icon: typeof PenLine }[] = [
  { value: 'edit', label: '純編輯', icon: PenLine },
  { value: 'split', label: '編輯 + 預覽', icon: Columns2 },
  { value: 'preview', label: '純預覽', icon: Eye },
];

const SAVE_STATE_LABEL: Record<SaveState, string> = {
  saved: '已儲存',
  saving: '儲存中...',
  unsaved: '有未儲存的變更',
  error: '儲存失敗',
};

interface AdminArticleEditorProps {
  articleId: string;
  onBack: () => void;
}

export const AdminArticleEditor = ({ articleId, onBack }: AdminArticleEditorProps) => {
  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  const [titleZh, setTitleZh] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionZh, setDescriptionZh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [contentZh, setContentZh] = useState<TiptapDoc>({ type: 'doc', content: [] });
  const [contentEn, setContentEn] = useState<TiptapDoc>({ type: 'doc', content: [] });
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ArticleStatus>('draft');

  const dirtyRef = useRef(false);
  const savingRef = useRef(false);

  useEffect(() => {
    fetchAdminArticle(articleId)
      .then((a) => {
        setArticle(a);
        setTitleZh(a.titleZh);
        setTitleEn(a.titleEn);
        setDescriptionZh(a.descriptionZh);
        setDescriptionEn(a.descriptionEn);
        setContentZh(a.contentZh);
        setContentEn(a.contentEn);
        setCoverImageUrl(a.coverImageUrl);
        setStatus(a.status);
        dirtyRef.current = false;
        setSaveState('saved');
      })
      .catch((err) => setError(err instanceof Error ? err.message : '無法載入文章，請稍後再試。'));
  }, [articleId]);

  const markDirty = () => {
    dirtyRef.current = true;
    setSaveState('unsaved');
  };

  const handleSave = async (nextStatus?: ArticleStatus) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaveState('saving');
    setError(null);
    try {
      const updated = await updateAdminArticle(articleId, {
        titleZh,
        titleEn,
        descriptionZh,
        descriptionEn,
        contentZh,
        contentEn,
        coverImageUrl: coverImageUrl ?? '',
        status: nextStatus ?? status,
      });
      setArticle(updated);
      setStatus(updated.status);
      dirtyRef.current = false;
      setSaveState('saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : '儲存失敗，請稍後再試。');
      setSaveState('error');
    } finally {
      savingRef.current = false;
    }
  };

  // Autosave every 30s while there are unsaved changes.
  useEffect(() => {
    const timer = setInterval(() => {
      if (dirtyRef.current && !savingRef.current) handleSave();
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, titleZh, titleEn, descriptionZh, descriptionEn, contentZh, contentEn, coverImageUrl, status]);

  const handleCoverCropConfirm = async (blob: Blob) => {
    setPendingCoverFile(null);
    setCoverUploading(true);
    try {
      const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
      const url = await uploadArticleImage(file);
      setCoverImageUrl(url);
      markDirty();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '封面圖上傳失敗，請稍後再試。');
    } finally {
      setCoverUploading(false);
    }
  };

  if (error && !article) {
    return (
      <div className="px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#023047] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </button>
          <p className="mt-6 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center gap-2 px-4 py-16 text-slate-400 sm:px-8">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-semibold">載入中...</span>
      </div>
    );
  }

  const title = lang === 'zh' ? titleZh : titleEn;
  const setTitle = lang === 'zh' ? setTitleZh : setTitleEn;
  const description = lang === 'zh' ? descriptionZh : descriptionEn;
  const setDescription = lang === 'zh' ? setDescriptionZh : setDescriptionEn;
  const content = lang === 'zh' ? contentZh : contentEn;
  const setContent = lang === 'zh' ? setContentZh : setContentEn;

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#023047] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold ${
                saveState === 'error'
                  ? 'text-red-600'
                  : saveState === 'unsaved'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
              }`}
            >
              {SAVE_STATE_LABEL[saveState]}
            </span>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saveState === 'saving'}
              className="flex items-center gap-1.5 rounded-3xl bg-[#023047] px-5 py-2 text-sm font-bold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {saveState === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
              儲存
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        {/* Cover image */}
        <div className="mt-6">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">封面圖</p>
          <label className="flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden border border-dashed border-slate-300 bg-slate-50 hover:border-[#023047]/40">
            {coverUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : coverImageUrl ? (
              <img src={coverImageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1.5 text-slate-400">
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs font-semibold">上傳封面圖</span>
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) setPendingCoverFile(file);
              }}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-full bg-slate-100 p-1">
            {(['zh', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                  lang === l ? 'bg-white text-[#023047] shadow-sm' : 'text-slate-500'
                }`}
              >
                {l === 'zh' ? '中文' : 'English'}
              </button>
            ))}
          </div>

          <div className="flex rounded-full bg-slate-100 p-1">
            {VIEW_MODE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.label}
                  onClick={() => setViewMode(opt.value)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full cursor-pointer transition-colors ${
                    viewMode === opt.value ? 'bg-white text-[#023047] shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            markDirty();
          }}
          placeholder={lang === 'zh' ? '文章標題（H1）' : 'Article title (H1)'}
          className="mt-4 w-full border-b-2 border-slate-200 bg-transparent pb-2 font-huninn text-2xl font-black text-[#023047] focus:border-[#023047] focus:outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            markDirty();
          }}
          rows={2}
          placeholder={lang === 'zh' ? '摘要（顯示在文章列表卡片上）' : 'Summary (shown on article list cards)'}
          className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
        />

        <div className={`mt-4 grid ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {viewMode !== 'preview' && (
            <ArticleEditor
              lang={lang}
              content={content}
              onChange={(doc) => {
                setContent(doc);
                markDirty();
              }}
            />
          )}
          {viewMode !== 'edit' && (
            <div
              className={`border border-slate-200 bg-white px-4 py-4 ${
                viewMode === 'split' ? 'border-l-0' : ''
              }`}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">預覽</p>
              <h1 className="font-huninn text-2xl font-black text-[#023047]">{title || '（未命名文章）'}</h1>
              <div className="mt-3">
                <ArticleReadOnly lang={lang} content={content} />
              </div>
            </div>
          )}
        </div>
      </div>

      {pendingCoverFile && (
        <ImageCropModal
          file={pendingCoverFile}
          onCancel={() => setPendingCoverFile(null)}
          onConfirm={handleCoverCropConfirm}
        />
      )}
    </div>
  );
};
