import Image from 'next/image'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  BadgeCheck,
  ExternalLink,
  Quote
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export function AboutSection() {
  const t = useTranslations('about')
  const bullets = t.raw('bullets') as string[]

  return (
    <section
      id="about"
      className="site-section border-b border-brand-navy/10 bg-brand-navy text-brand-white"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:px-8">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -top-4 -left-4 h-full w-full border border-brand-gold/70" />
          <div className="relative aspect-square overflow-hidden bg-brand-white">
            <Image
              src="/mindsay-avatar.png"
              alt="Min YANG"
              fill
              sizes="(max-width: 1024px) 448px, 36vw"
              className="object-cover"
            />
          </div>
          <p className="relative mt-4 bg-brand-gold px-5 py-3 text-sm font-black text-brand-navy">
            {t('roles')}
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-brand-gold uppercase">
              Life Design Lab
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              {t('name')}
            </h2>
          </div>

          <blockquote className="relative border-l-4 border-brand-gold bg-brand-white/8 p-6 text-lg leading-8 font-bold">
            <Quote
              aria-hidden="true"
              className="mb-4 size-8 text-brand-gold"
            />
            {t('quote')}
          </blockquote>

          <div className="grid gap-3 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-3 border border-brand-white/14 bg-brand-white/5 p-4 text-sm leading-6 font-semibold text-brand-white/80"
              >
                <BadgeCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-brand-gold"
                />
                {bullet}
              </div>
            ))}
          </div>

          <div className="space-y-4 text-base leading-8 text-brand-white/75">
            <p>{t('paragraph1')}</p>
            <p>{t('paragraph2')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-brand-white/15 pt-6">
            <FontAwesomeIcon
              aria-hidden="true"
              className="size-5 text-brand-gold"
              icon={faInstagram}
            />
            <span className="text-sm font-semibold text-brand-white/70">
              {t('igLine')}
            </span>
            <a
              href="https://www.instagram.com/mindsayseverything"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-gold px-4 text-sm font-black text-brand-navy"
            >
              @mindsayseverything
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
