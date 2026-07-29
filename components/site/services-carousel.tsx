'use client'

import Image from 'next/image'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/navigation'
import {
  getCarouselOffset,
  getSwipeDirection,
  wrapIndex
} from '../../lib/service-carousel'
import {
  SERVICE_ICON_MAP,
  SERVICE_IDS,
  type ServiceId
} from '../../lib/site-config'
import { SectionHeading } from './section-heading'

function getCardStyle(offset: number): React.CSSProperties {
  if (offset === 0) {
    return {
      transform: 'translateX(-50%) scale(1) rotateY(0deg)',
      opacity: 1,
      filter: 'blur(0)',
      zIndex: 30
    }
  }

  if (offset === -1) {
    return {
      transform:
        'translateX(-50%) translateX(-58%) scale(0.84) rotateY(10deg)',
      opacity: 0.5,
      filter: 'blur(4px)',
      zIndex: 10
    }
  }

  if (offset === 1) {
    return {
      transform:
        'translateX(-50%) translateX(58%) scale(0.84) rotateY(-10deg)',
      opacity: 0.5,
      filter: 'blur(4px)',
      zIndex: 10
    }
  }

  return {
    transform: 'translateX(-50%) scale(0.7) translateZ(-180px)',
    opacity: 0,
    filter: 'blur(8px)',
    zIndex: 0,
    pointerEvents: 'none'
  }
}

export function ServicesCarousel() {
  const t = useTranslations('services')
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const total = SERVICE_IDS.length
  const next = useCallback(() => {
    setCurrentIndex((index) => wrapIndex(index + 1, total))
  }, [total])
  const previous = useCallback(() => {
    setCurrentIndex((index) => wrapIndex(index - 1, total))
  }, [total])

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) {
      return
    }

    const direction = getSwipeDirection(
      touchStartX.current,
      event.changedTouches[0]?.clientX ?? touchStartX.current
    )
    touchStartX.current = null

    if (direction === 1) {
      next()
    } else if (direction === -1) {
      previous()
    }
  }

  return (
    <section
      id="services"
      className="site-section overflow-hidden border-b border-brand-navy/10 bg-brand-navy/[0.025]"
      onKeyDown={handleKeyDown}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={t('label')} title={t('heading')} />
          <p className="max-w-sm text-sm leading-6 font-semibold text-brand-navy/60 sm:text-right">
            {t('hint')}
          </p>
        </div>

        <div className="depth-stage relative min-h-[650px] sm:min-h-[700px]">
          <button
            type="button"
            aria-label={t('previous')}
            onClick={previous}
            className="absolute top-1/2 left-0 z-40 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand-navy/15 bg-brand-white/95 text-brand-navy shadow-xl transition-transform hover:scale-110 sm:left-4 sm:size-14"
          >
            <ChevronLeft aria-hidden="true" className="size-6" />
          </button>
          <button
            type="button"
            aria-label={t('next')}
            onClick={next}
            className="absolute top-1/2 right-0 z-40 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand-navy/15 bg-brand-white/95 text-brand-navy shadow-xl transition-transform hover:scale-110 sm:right-4 sm:size-14"
          >
            <ChevronRight aria-hidden="true" className="size-6" />
          </button>

          <div className="relative mx-auto h-[610px] w-full max-w-2xl sm:h-[660px]">
            {SERVICE_IDS.map((id, index) => {
              const offset = getCarouselOffset(index, currentIndex, total)
              const isActive = offset === 0

              return (
                <ServiceCard
                  key={id}
                  id={id}
                  isActive={isActive}
                  style={getCardStyle(offset)}
                  onSelect={() => setCurrentIndex(index)}
                />
              )
            })}
          </div>
        </div>

        <p className="text-center text-xs font-black tracking-[0.12em] text-brand-navy/50 uppercase">
          {t('counter', { current: currentIndex + 1, total })}
        </p>
      </div>
    </section>
  )
}

function ServiceCard({
  id,
  isActive,
  style,
  onSelect
}: {
  id: ServiceId
  isActive: boolean
  style: React.CSSProperties
  onSelect: () => void
}) {
  const t = useTranslations('services')
  const Icon = SERVICE_ICON_MAP[id]
  const title = t(`items.${id}.title`)

  return (
    <article
      style={style}
      aria-hidden={!isActive}
      className="depth-card absolute top-0 left-1/2 w-[min(82vw,34rem)] overflow-hidden rounded-[2rem] border border-brand-navy/15 bg-brand-white shadow-[0_28px_80px_rgba(2,48,71,0.18)] transition-[transform,opacity,filter] duration-500 ease-out motion-reduce:transition-none"
    >
      {!isActive && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={title}
          onClick={onSelect}
          className="absolute inset-0 z-20 cursor-pointer"
        />
      )}

      <div className="relative aspect-[16/8.5] overflow-hidden bg-brand-navy">
        <Image
          src={`/services/${id}.jpg`}
          alt=""
          fill
          sizes="(max-width: 640px) 82vw, 544px"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/50 bg-brand-navy/85 px-3 py-1.5 text-xs font-black text-brand-gold backdrop-blur">
          <Icon aria-hidden="true" className="size-4" />
          {t(`items.${id}.tag`)}
        </span>
        <div className="absolute right-5 bottom-5 left-5 text-brand-white">
          <h3 className="text-2xl font-black tracking-[-0.035em]">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-brand-white/75">
            {t(`items.${id}.subtitle`)}
          </p>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <p className="min-h-20 text-sm leading-7 font-semibold text-brand-navy/70 sm:text-base">
          {t(`items.${id}.desc`)}
        </p>
        <div className="flex items-center gap-2 text-xs font-bold text-brand-navy/60">
          <CheckCircle2 aria-hidden="true" className="size-4 text-brand-sky" />
          {t(`items.${id}.tag`)}
        </div>
        <div className="grid gap-3 border-t border-brand-navy/10 pt-5 sm:grid-cols-2">
          <Link
            href={`/services/${id}`}
            tabIndex={isActive ? 0 : -1}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-navy/15 px-4 text-sm font-black text-brand-navy transition-colors hover:border-brand-sky hover:bg-brand-sky/10"
          >
            {t('viewDetail')}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <a
            href="#booking"
            tabIndex={isActive ? 0 : -1}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 text-sm font-black text-brand-navy transition-transform hover:-translate-y-0.5"
          >
            <CalendarDays aria-hidden="true" className="size-4" />
            {t('bookNow')}
          </a>
        </div>
      </div>
    </article>
  )
}
