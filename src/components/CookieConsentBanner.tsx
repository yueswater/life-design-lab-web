import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { getCookieConsent, setCookieConsent, CookieConsent } from '../lib/cookieConsent';

export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  const choose = (value: CookieConsent) => {
    setCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-[#023047]/60" />
          <p className="text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
            我們使用 Cookie 來記錄文章瀏覽次數等基本統計，協助我們了解內容成效。你可以選擇是否接受。
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            拒絕
          </button>
          <button
            type="button"
            onClick={() => choose('necessary')}
            className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300 cursor-pointer"
          >
            僅必要
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="rounded-full bg-[#023047] px-4 py-1.5 text-xs font-bold text-white hover:brightness-110 cursor-pointer"
          >
            接受全部
          </button>
        </div>
      </div>
    </div>
  );
};
