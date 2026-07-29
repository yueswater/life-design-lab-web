import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import type { LayoutContext } from '../components/Layout';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';
import { modulesData } from '../data/modulesData';
import { ModuleItem } from '../types';
import { MODULE_ICON_MAP } from '../lib/module-icons';
import { useBookingForm } from '../hooks/useBookingForm';
import { BookingFormFields } from '../components/booking/BookingFormFields';

export default function BookPage() {
  const { showToast } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = useTranslation();
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);

  const form = useBookingForm(
    selectedModule,
    lang,
    t,
    (title) => {
      showToast(t.toast.bookingSuccess(title));
      navigate('/');
    },
    (message) => showToast(message)
  );

  return (
    <section className="w-full px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-[#023047]/50">
          {t.booking.eyebrow}
        </p>
        <h1 className="font-huninn text-3xl font-black tracking-tight text-[#023047] sm:text-4xl">
          {t.booking.title}
        </h1>
        <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-slate-600">
          {t.booking.subtitle}
        </p>

        {/* Module Selector — flat cards, single level, no nested containers */}
        <div className="mt-10">
          <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            {t.booking.selectModule}
          </label>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {modulesData.map((item) => {
              const ModuleIcon = MODULE_ICON_MAP[item.iconKey];
              const active = selectedModule?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedModule(item)}
                  aria-pressed={active}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-colors cursor-pointer ${
                    active ? 'border-[#023047] bg-[#023047]' : 'border-slate-200 bg-white hover:border-[#023047]'
                  }`}
                >
                  {!active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 z-0 -translate-x-full bg-[#023047] transition-transform duration-500 ease-out group-hover:translate-x-0 motion-reduce:transition-none"
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                      active
                        ? 'bg-[#FBD634] text-[#023047]'
                        : 'bg-slate-100 text-[#023047] group-hover:bg-[#FBD634]'
                    }`}
                  >
                    <ModuleIcon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="relative z-10 min-w-0">
                    <span
                      className={`block truncate text-sm font-bold transition-colors duration-500 ${
                        active ? 'text-white' : 'text-[#023047] group-hover:text-white'
                      }`}
                    >
                      {item.title[lang].split('|')[0].trim()}
                    </span>
                    <span
                      className={`block truncate text-xs font-medium transition-colors duration-500 ${
                        active ? 'text-white/70' : 'text-slate-500 group-hover:text-white/70'
                      }`}
                    >
                      {item.subtitle[lang]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking Form — only once a module is picked */}
        {selectedModule && (
          <form onSubmit={form.handleSubmit} className="mt-10 border-t border-slate-100 pt-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-[#023047]">
                {t.booking.formIntro(selectedModule.title[lang].split('|')[0].trim())}
              </p>
              <button
                type="button"
                onClick={() => setSelectedModule(null)}
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#023047]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t.booking.changeModule}
              </button>
            </div>

            <BookingFormFields form={form} lang={lang} t={t} />

            <button
              type="submit"
              disabled={form.submitting}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FBD634] py-3 text-sm font-black text-[#023047] transition-all hover:brightness-95 disabled:cursor-not-allowed ${
                form.canSubmit ? '' : 'opacity-50'
              }`}
            >
              {form.submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{form.submitting ? t.moduleModal.submitting : t.booking.submit}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
