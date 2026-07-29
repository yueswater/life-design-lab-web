import React from 'react';
import { testimonialsData } from '../data/testimonialsData';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/strings';

export const TestimonialsSection: React.FC = () => {
  const { lang } = useLanguage();
  const t = useTranslation();
  const featured = testimonialsData.find((item) => item.featured) ?? testimonialsData[0];
  const rest = testimonialsData.filter((item) => item.id !== featured.id);

  return (
    <section
      id="testimonials"
      className="w-full scroll-mt-24 bg-[#023047] px-4 py-16 sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#FBD634]">
              {t.testimonials.eyebrow}
            </p>
            <h2 className="font-huninn text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              {t.testimonials.titlePre}
              <span className="text-[#FBD634]">{t.testimonials.titleAccent}</span>
            </h2>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[#FBD634] text-[#FBD634]" />
              ))}
            </div>
            <span className="text-xs font-bold text-white/90">{t.testimonials.ratingBadge}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-24">
          {/* Featured Card */}
          <article className="relative overflow-hidden rounded-2xl bg-white p-7 sm:p-10 lg:col-span-15">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 left-4 select-none font-serif text-[18rem] leading-none text-[#FBD634] sm:-top-20 sm:text-[22rem]"
            >
              ❝
            </span>

            <div className="relative flex h-full flex-col pt-32 sm:pt-40">
              <div className="flex flex-1 items-center">
                <p className="font-huninn text-2xl font-bold leading-relaxed tracking-tight text-balance text-[#023047] sm:text-3xl sm:leading-[1.6]">
                  {featured.quote[lang]}
                </p>
              </div>

              <div className="mt-8 flex items-end justify-between gap-6 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-4">
                  <img
                    src={featured.imageUrl}
                    alt={featured.author}
                    loading="lazy"
                    className="h-16 w-16 rounded-full object-cover object-center sm:h-20 sm:w-20"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-black text-[#023047]">{featured.author}</p>
                      <span className="rounded-full bg-[#FBD634] px-3 py-1 text-xs font-black text-[#023047]">
                        {featured.tag[lang]}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500 sm:text-sm">
                      <span>
                        {lang === 'zh'
                          ? featured.originalRole.zh.replace(/^原/, '')
                          : featured.originalRole.en}
                      </span>
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-[#023047]" />
                      <span className="font-black text-[#023047]">
                        {lang === 'zh'
                          ? featured.authorTitle.zh.replace(/^現為/, '')
                          : featured.authorTitle.en}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Small Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-1">
            {rest.map((item) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 transition-colors duration-500"
              >
                {/* Hover slide fill, same language as hero button */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 z-0 -translate-x-full bg-[#FBD634] transition-transform duration-500 ease-out group-hover:translate-x-0 motion-reduce:transition-none"
                />

                <div className="relative z-10">
                  <p className="text-sm font-semibold leading-relaxed text-white/85 transition-colors duration-300 group-hover:text-[#023047]">
                    「{item.quote[lang]}」
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.author}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover object-center grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white transition-colors duration-300 group-hover:text-[#023047]">
                        {item.author}
                        <span className="ml-2 font-bold text-[#FBD634] transition-colors duration-300 group-hover:text-[#023047]/70">
                          {item.tag[lang]}
                        </span>
                      </p>
                      <p className="truncate text-xs font-semibold text-white/60 transition-colors duration-300 group-hover:text-[#023047]/80">
                        {item.authorTitle[lang]}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
