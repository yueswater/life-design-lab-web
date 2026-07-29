import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';

interface HeroSectionProps {
  onTryFree: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTryFree }) => {
  const [scrollY, setScrollY] = useState(0);
  const { lang } = useLanguage();
  const t = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Paper plane flies up-right and shrinks as the page scrolls down
  const planeShift = Math.min(scrollY, 900);
  const planeStyle: React.CSSProperties = {
    transform: `translate(${planeShift * 0.45}px, ${-planeShift * 0.55}px) scale(${Math.max(
      1 - planeShift / 1100,
      0.25
    )})`,
    opacity: Math.max(1 - planeShift / 800, 0),
  };

  return (
    <section className="w-full overflow-x-hidden bg-white px-4 sm:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center py-12 sm:py-16 lg:min-h-[42rem] lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl text-left">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-[#023047]/65">
            {t.hero.eyebrow}
          </p>

          {/* Heading + a small plane riding beside it on mobile/tablet */}
          <div className="relative">
            <img
              src="/logo-yellow.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-8 top-10 w-16 object-contain will-change-transform sm:right-10 sm:top-12 sm:w-20 lg:hidden"
              style={planeStyle}
            />
            <h1 className="font-huninn text-5xl font-black leading-[0.94] tracking-[-0.055em] text-[#023047] sm:text-6xl lg:text-7xl">
              {t.hero.titleLine1}
              <br />
              {t.hero.titleLine2}
            </h1>
          </div>

          {lang === 'zh' ? (
            <p className="mt-7 max-w-lg text-sm font-semibold leading-7 text-[#023047]/75 sm:text-base">
              <strong className="font-black text-[#023047]">
                生命設計 (Life Design)
              </strong>
              ，是把自己的生命當作一個待解決的
              <strong className="font-black text-[#023047]">設計問題</strong>
              ，透過
              <strong className="font-black text-[#023047]">
                設計思考 (Design Thinking)
              </strong>{' '}
              的方法，拆解適合自己的生活方式。
            </p>
          ) : (
            <p className="mt-7 max-w-lg text-sm font-semibold leading-7 text-[#023047]/75 sm:text-base">
              <strong className="font-black text-[#023047]">Life Design</strong> means
              treating your own life as a problem worth{' '}
              <strong className="font-black text-[#023047]">designing</strong>, not just
              living through. Using the tools of{' '}
              <strong className="font-black text-[#023047]">Design Thinking</strong>, we
              break it down into a way of living that actually fits you.
            </p>
          )}
          <button
            type="button"
            onClick={onTryFree}
            className="group relative mt-9 inline-flex min-h-12 items-center overflow-hidden rounded-full border-2 border-[#023047] bg-[#023047] px-7 text-sm font-black text-white"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 -translate-x-full bg-[#FBD634] transition-transform duration-500 ease-out group-hover:translate-x-0"
            />
            <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-[#023047]">
              {t.hero.cta}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </button>
        </div>

        <div
          aria-hidden="true"
          className="hidden items-center justify-center lg:flex lg:min-h-80"
        >
          <img
            src="/logo-yellow.svg"
            alt=""
            className="w-96 max-w-full object-contain will-change-transform xl:w-[30rem]"
            style={planeStyle}
          />
        </div>
      </div>
    </section>
  );
};
