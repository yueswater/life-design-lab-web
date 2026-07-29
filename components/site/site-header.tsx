'use client'

import Image from 'next/image'
import { useState } from 'react'
import { CalendarDays, Languages, Menu, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '../../i18n/navigation'

export function SiteHeader() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const targetLocale = locale === 'zh-TW' ? 'en' : 'zh-TW'
  const targetLocaleLabel = targetLocale === 'zh-TW' ? '中文' : 'EN'
  const links = [
    ['#intro', t('intro')],
    ['#services', t('services')],
    ['#blog', t('blog')],
    ['#about', t('about')]
  ] as const

  return (
    <header className="sticky top-0 z-50 border-b border-brand-navy/10 bg-brand-white/92 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <a
          href="#intro"
          className="group flex min-w-0 items-center gap-3 rounded-xl"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-navy/10 bg-brand-white shadow-sm transition-transform group-hover:-rotate-3">
            <Image
              src="/icon.svg"
              alt=""
              width={40}
              height={40}
              className="size-full object-cover"
              priority
            />
          </span>
          <span className="truncate text-lg font-black tracking-[-0.035em] text-brand-navy sm:text-xl">
            Life Design Lab
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-brand-navy/10 bg-brand-navy/[0.035] p-1.5 lg:flex"
        >
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-bold text-brand-navy/70 transition-colors hover:bg-brand-white hover:text-brand-navy"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href={pathname}
            locale={targetLocale}
            aria-label={t('switchLanguage')}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-navy/15 px-3.5 text-sm font-bold text-brand-navy transition-colors hover:border-brand-sky hover:bg-brand-sky/10"
          >
            <Languages aria-hidden="true" className="size-4" />
            {targetLocaleLabel}
          </Link>
          <a
            href="#booking"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-gold px-5 text-sm font-black text-brand-navy shadow-[0_8px_24px_rgba(2,48,71,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <CalendarDays aria-hidden="true" className="size-4" />
            {t('bookingCta')}
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy sm:hidden"
        >
          {menuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="border-t border-brand-navy/10 bg-brand-white px-4 py-4 sm:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-bold text-brand-navy hover:bg-brand-sky/10"
              >
                {label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-brand-navy/10 pt-4">
              <Link
                href={pathname}
                locale={targetLocale}
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-navy/15 font-bold text-brand-navy"
              >
                <Languages aria-hidden="true" className="size-4" />
                {targetLocaleLabel}
              </Link>
              <a
                href="#booking"
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-gold px-3 text-center text-sm font-black text-brand-navy"
              >
                <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                {t('bookingCta')}
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
