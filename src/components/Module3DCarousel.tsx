import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ModuleItem } from '../types';
import { Clock, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { MODULE_ICON_MAP } from '../lib/module-icons';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';

interface Module3DCarouselProps {
  modules: ModuleItem[];
  onSelectModule: (module: ModuleItem) => void;
  onBooking: (module: ModuleItem) => void;
}

export const Module3DCarousel: React.FC<Module3DCarouselProps> = ({
  modules,
  onSelectModule,
  onBooking,
}) => {
  const { lang } = useLanguage();
  const t = useTranslation();
  const [progress, setProgress] = useState(0); // 0..1 continuous scroll progress
  const [shift, setShift] = useState(0); // horizontal translate in px
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const total = modules.length;
  const progressIndex = progress * (total - 1); // fractional card position
  const currentIndex = Math.round(progressIndex);

  // Mobile drops the vertical-scroll-jack in favor of a plain horizontal
  // swipe on the filmstrip itself — matches the `sm` breakpoint used below.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  // Desktop: vertical page scroll inside the tall section drives the strip
  useEffect(() => {
    if (isMobile) return;
    const update = () => {
      const el = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!el || !viewport || !track) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(Math.max(-el.getBoundingClientRect().top / scrollable, 0), 1);
      setProgress(p);
      setShift(p * Math.max(track.scrollWidth - viewport.clientWidth, 0));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isMobile]);

  // Mobile: native horizontal scroll on the viewport drives progress instead
  useEffect(() => {
    if (!isMobile) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const update = () => {
      const scrollable = viewport.scrollWidth - viewport.clientWidth;
      const p = scrollable > 0 ? Math.min(Math.max(viewport.scrollLeft / scrollable, 0), 1) : 0;
      setProgress(p);
    };
    update();
    viewport.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      viewport.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isMobile]);

  // Keyboard / click navigation: scrolls the page (desktop) or the
  // filmstrip itself (mobile) to bring the target card into view.
  const scrollToIndex = useCallback(
    (idx: number) => {
      const clamped = Math.min(Math.max(idx, 0), total - 1);

      if (isMobile) {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        const card = track?.children[clamped] as HTMLElement | undefined;
        if (!viewport || !card) return;
        viewport.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
        return;
      }

      const el = sectionRef.current;
      if (!el) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      const top =
        el.getBoundingClientRect().top +
        window.scrollY +
        (clamped / (total - 1)) * scrollable;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [total, isMobile]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToIndex, currentIndex]);

  return (
    /* Desktop: tall scroll track, vertical scroll drives the pinned filmstrip.
       Mobile: natural height, the filmstrip scrolls horizontally on its own. */
    <section
      id="modules"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: isMobile ? 'auto' : `${total * 100}vh` }}
    >
      <div
        className={
          isMobile
            ? 'flex flex-col bg-white pt-8 pb-10'
            : 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-white pt-8 pb-[3vh] sm:pt-10'
        }
      >
        {/* Section Header */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          {/* <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-[#023047]/60">
            {t.modules.eyebrow}
          </p> */}
          {/* <h2 className="font-huninn text-2xl font-black leading-tight tracking-tight text-[#023047] sm:text-3xl">
            {t.modules.titlePre}
            <span className="text-[#023047]">{t.modules.titleAccent}</span>
          </h2> */}
        </div>

        {/* Horizontal Filmstrip */}
        <div
          ref={viewportRef}
          className={
            isMobile
              ? 'mt-4 scrollbar-hide overflow-x-auto snap-x snap-mandatory'
              : 'mt-4 overflow-hidden sm:mt-6'
          }
        >
          <div
            ref={trackRef}
            className="flex w-max items-stretch gap-6 px-4 sm:px-8"
            style={isMobile ? undefined : { transform: `translate3d(-${shift}px, 0, 0)` }}
          >
            {modules.map((item, idx) => {
              const ModuleIcon = MODULE_ICON_MAP[item.iconKey];
              const title = item.title[lang];

              return (
                <article
                  key={item.id}
                  onClick={() => {
                    if (idx !== currentIndex) scrollToIndex(idx);
                  }}
                  className={`flex w-[82vw] flex-col snap-start sm:w-[60vw] lg:w-[36rem] ${idx === currentIndex ? '' : 'cursor-pointer'
                    }`}
                >
                  {/* Title Row */}
                  <div className="flex items-center gap-2.5 pb-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#023047] text-[#FBD634]">
                      <ModuleIcon aria-hidden="true" className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-huninn truncate text-xl font-black tracking-tight text-[#023047] sm:text-2xl">
                        {title.includes('|') ? (
                          <>
                            {title.split('|')[0].trim()} |{' '}
                            <span className="text-[#023047]/35">{title.split('|')[1].trim()}</span>
                          </>
                        ) : (
                          title
                        )}
                      </h3>
                      <p className="truncate text-xs font-bold text-[#023047]/60">
                        {item.subtitle[lang]}
                      </p>
                    </div>
                  </div>

                  {/* Image Row with parallax: image drifts opposite to the strip motion */}
                  <div className="relative aspect-[16/9] max-h-[38vh] w-full overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={item.imageUrl}
                      alt={title}
                      className="h-full w-full object-cover"
                      style={{
                        transform: `translateX(${(idx - progressIndex) * 32}px) scale(1.12)`,
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Text Row */}
                  <div className="flex flex-1 flex-col justify-between pt-5">
                    <div>
                      <p className="max-w-lg text-sm font-semibold leading-relaxed text-[#023047] sm:text-[15px] sm:leading-7">
                        {item.description[lang]}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-bold text-[#023047]/70">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {item.duration[lang]}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          {item.format[lang]}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 pb-1 pt-5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBooking(item);
                        }}
                        className="group relative inline-flex min-h-11 cursor-pointer items-center overflow-hidden rounded-full border-2 border-[#023047] bg-[#023047] px-6 text-sm font-black text-white"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 z-0 -translate-x-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0 motion-reduce:transition-none"
                        />
                        <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap transition-colors duration-300 group-hover:text-[#023047]">
                          {t.modules.bookCta}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectModule(item);
                        }}
                        className="group relative inline-flex min-h-11 cursor-pointer items-center overflow-hidden rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-[#023047]"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 z-0 -translate-x-full bg-[#023047] transition-transform duration-500 ease-out group-hover:translate-x-0 motion-reduce:transition-none"
                        />
                        <span className="relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap transition-colors duration-300 group-hover:text-white">
                          {t.modules.detailsCta}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Hint: only meaningful for the desktop wheel/keyboard interaction */}
        {!isMobile && (
          <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-8">
            <p className="text-center text-xs font-bold text-[#023047]/55">
              {t.modules.hint}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
