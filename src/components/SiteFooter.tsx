import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/strings';

export const SiteFooter: React.FC = () => {
  const t = useTranslation();

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/50 py-6 text-xs text-slate-400 sm:py-8">
      {/* Mobile-only brand lockup, centered above the copyright row */}
      <div className="mb-3 flex items-center justify-center gap-2 px-4 sm:hidden">
        <img src="/logo.svg" alt="" className="h-8 w-8 shrink-0 object-contain" />
        <div className="flex flex-col items-center leading-none">
          <span className="text-sm font-extrabold tracking-tight text-[#023047]">生命設計實驗室</span>
          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#023047]/50">
            Life Design Lab
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-3 px-4 text-center sm:grid-cols-3 sm:gap-4 sm:px-8 sm:text-left">
        <div className="order-2 flex flex-col gap-3 text-slate-400 sm:order-1 sm:block sm:gap-0 sm:justify-self-start">
          <div className="sm:inline">{t.footer.copyright(new Date().getFullYear())}</div>
          <a
            href="https://yueswater.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-slate-500 transition-colors sm:before:mx-1.5 sm:before:content-['·']"
          >
            Created by Yueswater
          </a>
        </div>

        {/* True dead-center: an equal-width grid column, not just "between" the other two.
            Hidden on mobile — the logo lockup above already covers this. */}
        <div className="hidden text-center font-semibold text-slate-700 sm:order-2 sm:block">
          {t.footer.brandName}
        </div>

        <div className="order-1 flex items-center justify-center gap-4 text-slate-500 sm:order-3 sm:justify-self-end">
          <Link to="/privacy" className="hover:text-[#FBD634] transition-colors">
            {t.footer.privacy}
          </Link>
          <Link to="/terms" className="hover:text-[#FBD634] transition-colors">
            {t.footer.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
};
