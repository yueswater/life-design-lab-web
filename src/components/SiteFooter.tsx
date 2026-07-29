import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/strings';

export const SiteFooter: React.FC = () => {
  const t = useTranslation();

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/50 py-6 text-xs text-slate-400 sm:py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-3 px-4 text-center sm:grid-cols-3 sm:gap-4 sm:px-8 sm:text-left">
        <div className="text-slate-400 sm:justify-self-start">
          {t.footer.copyright(new Date().getFullYear())}
          <span className="mx-1.5 text-slate-300">·</span>
          <a
            href="https://yueswater.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-slate-500 transition-colors"
          >
            Created by Yueswater
          </a>
        </div>

        {/* True dead-center: an equal-width grid column, not just "between" the other two */}
        <div className="text-center font-semibold text-slate-700">{t.footer.brandName}</div>

        <div className="flex items-center justify-center gap-4 text-slate-500 sm:justify-self-end">
          <Link to="/privacy" className="hover:text-slate-800 transition-colors">
            {t.footer.privacy}
          </Link>
          <Link to="/terms" className="hover:text-slate-800 transition-colors">
            {t.footer.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
};
