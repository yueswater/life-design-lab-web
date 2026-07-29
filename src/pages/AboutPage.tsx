import { useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LayoutContext } from '../components/Layout';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';

export default function AboutPage() {
  const { openTryFree } = useOutletContext<LayoutContext>();
  const { lang } = useLanguage();
  const t = useTranslation();

  return (
    <>
      {/* Intro */}
      <section className="w-full px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-14 lg:grid-cols-[22rem_1fr] lg:gap-20">
          {/* Photo, with a single quiet accent ring */}
          <div className="relative mx-auto w-56 sm:w-64 lg:w-full">
            <div className="relative aspect-square w-full overflow-hidden rounded-full bg-slate-100 shadow-xl">
              <img
                src="/about-min.jpeg"
                alt="Min，生命設計實驗室教練"
                className="h-full w-full scale-110 object-cover"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="text-left">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-[#023047]/50">
              {t.about.eyebrow}
            </p>
            <h1 className="font-huninn text-5xl font-black leading-none tracking-[-0.03em] text-[#023047] sm:text-6xl">
              Min
            </h1>
            <p className="mt-3 text-sm font-bold text-[#023047]/70 sm:text-base">
              {t.about.role}
            </p>
            {lang === 'zh' ? (
              <p className="mt-6 max-w-lg text-sm font-medium leading-8 text-slate-600 sm:text-base">
                我是 Min，生命設計實驗室的創辦人與教練。我相信每一個生命，都值得被認真設計，而不是隨波逐流地被決定。
                <br />
                透過設計思考的方法，我陪伴一個又一個在職涯與人生路口猶豫的人，重新梳理自己的價值觀、拆解卡關已久的難題，
                一步步打造出屬於自己、走得下去的下一步。
              </p>
            ) : (
              <p className="mt-6 max-w-lg text-sm font-medium leading-8 text-slate-600 sm:text-base">
                I&apos;m Min, founder and coach at Life Design Lab. I believe every life
                deserves to be deliberately designed — not just decided by default.
                <br />
                Using the tools of design thinking, I&apos;ve helped many people standing
                at a career or life crossroads re-rank their values, unpack problems they&apos;d
                been stuck on for years, and build a next step that&apos;s truly their own.
              </p>
            )}

            <button
              type="button"
              onClick={openTryFree}
              className="group relative mt-9 inline-flex min-h-12 items-center overflow-hidden rounded-full border-2 border-[#023047] bg-[#023047] px-7 text-sm font-black text-white"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 z-0 -translate-x-full bg-[#FBD634] transition-transform duration-500 ease-out group-hover:translate-x-0"
              />
              <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-[#023047]">
                {t.about.cta}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="w-full bg-[#023047] px-4 py-24 sm:px-8 sm:py-32">
        <div className="relative mx-auto max-w-3xl text-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none font-serif text-[10rem] leading-none text-[#FBD634]/90 sm:text-[13rem]"
          >
            ❝
          </span>
          <p className="font-huninn relative text-2xl font-black leading-relaxed tracking-tight text-balance text-white sm:text-4xl sm:leading-[1.5]">
            {t.about.quoteLine1}
            <br className="hidden sm:block" />
            {t.about.quoteLine2}
          </p>
        </div>
      </section>
    </>
  );
}
