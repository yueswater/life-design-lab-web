import React from 'react';
import { ModuleItem } from '../types';
import { X, CheckCircle2, Mail, Users, Clock, Sparkles, Target, Loader2 } from 'lucide-react';
import { MODULE_ICON_MAP } from '../lib/module-icons';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';
import { useBookingForm } from '../hooks/useBookingForm';
import { BookingFormFields } from './booking/BookingFormFields';

interface ModuleDetailModalProps {
  module: ModuleItem | null;
  mode: 'details' | 'booking' | null;
  onClose: () => void;
  onBookingSuccess?: (moduleTitle: string) => void;
  onValidationError?: (message: string) => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  mode,
  onClose,
  onBookingSuccess,
  onValidationError,
}) => {
  const { lang } = useLanguage();
  const t = useTranslation();
  const form = useBookingForm(
    mode === 'booking' ? module : null,
    lang,
    t,
    (title) => {
      onBookingSuccess?.(title);
      onClose();
    },
    onValidationError
  );

  if (!module || !mode) return null;
  const ModuleIcon = MODULE_ICON_MAP[module.iconKey];
  const title = module.title[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="scrollbar-hide bg-white rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 transition-colors cursor-pointer ${
            mode === 'details'
              ? 'text-white/85 hover:text-white drop-shadow-md'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Details Mode */}
        {mode === 'details' && (
          <div className="p-5 sm:p-6 pt-0 sm:pt-0">
            {/* Full-bleed cover image */}
            <div className="relative -mx-5 sm:-mx-6 mb-4 h-28 sm:h-36 overflow-hidden rounded-t-3xl bg-slate-100">
              <img
                src={module.imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 mb-1.5">
              <ModuleIcon aria-hidden="true" className="w-5 h-5" />
              <span>{title}</span>
            </h3>

            <p className="mb-3 flex items-start gap-1.5 border-l-2 border-[#FBD634] pl-3 text-xs font-semibold text-slate-700">
              <Target
                aria-hidden="true"
                className="mt-0.5 w-4 h-4 shrink-0 text-[#023047]"
              />
              <span>
                <span className="whitespace-nowrap font-bold text-[#023047]">{t.moduleModal.target}</span>{' '}
                {module.target[lang]}
              </span>
            </p>

            <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
              {module.description[lang]}
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 py-2 border-y border-slate-100 font-medium text-slate-700">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 shrink-0 text-slate-700" />
                  <span>{t.moduleModal.format}</span>
                  <span className="font-semibold text-slate-900">{module.format[lang]}</span>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-slate-700" />
                  <span>{t.moduleModal.duration}</span>
                  <span className="font-semibold text-slate-900">{module.duration[lang]}</span>
                </div>
              </div>

              <div className="py-1">
                <span className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-slate-800" />
                  <span>{t.moduleModal.features}</span>
                </span>
                <ul className="space-y-1.5">
                  {module.features[lang].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
                      <span className="text-balance">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t.moduleModal.close}
              </button>
              <a
                href={`mailto:contact@life-design-lab.space?subject=${encodeURIComponent(
                  t.moduleModal.mailSubject + title
                )}`}
                className="bg-[#FBD634] hover:brightness-95 text-[#023047] font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>{t.moduleModal.bookViaEmail}</span>
              </a>
            </div>
          </div>
        )}

        {/* Booking Form Mode */}
        {mode === 'booking' && (
          <form onSubmit={form.handleSubmit} className="p-6 sm:p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#023047] text-[#FBD634] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {t.moduleModal.bookingTitle}{title}
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              {t.moduleModal.bookingIntro}
            </p>

            <BookingFormFields form={form} lang={lang} t={t} />

            <div className="mt-4 pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl cursor-pointer"
              >
                {t.moduleModal.cancel}
              </button>
              <button
                type="submit"
                disabled={form.submitting}
                className={`flex-1 bg-[#FBD634] hover:brightness-95 disabled:cursor-not-allowed text-[#023047] font-bold py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 ${
                  form.canSubmit ? '' : 'opacity-50'
                }`}
              >
                {form.submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{form.submitting ? t.moduleModal.submitting : t.moduleModal.submit}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
