'use client'

import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  ListChecks
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '../../../../i18n/navigation'
import {
  isServiceId,
  SERVICE_ICON_MAP
} from '../../../../lib/site-config'

type StructureColumns = { col1: string; col2: string; col3?: string }
type StructureRow = { stage: string; content: string; duration?: string }
type PricingColumns = { col1: string; col2: string }
type PricingRow = { label: string; detail: string }

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = params.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const t = useTranslations('serviceDetail')

  if (!id || !isServiceId(id)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-navy p-6">
        <div className="w-full max-w-lg border border-brand-white/15 bg-brand-white p-8 text-center shadow-[18px_18px_0_0_#FFDF65] sm:p-12">
          <CircleAlert
            aria-hidden="true"
            className="mx-auto size-12 text-brand-sky"
          />
          <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-brand-navy">
            {t('notFoundTitle')}
          </h1>
          <p className="mt-3 font-semibold text-brand-navy/60">
            {t('notFoundBody')}
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-8 inline-flex min-h-12 items-center gap-2 bg-brand-gold px-6 font-black text-brand-navy"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            {t('notFoundBackHome')}
          </button>
        </div>
      </main>
    )
  }

  const title = t(`items.${id}.title`)
  const subtitle = t(`items.${id}.subtitle`)
  const imageAlt = t(`items.${id}.imageAlt`)
  const introText = t(`items.${id}.introText`)
  const extraNotice = t.has(`items.${id}.extraNotice`)
    ? t(`items.${id}.extraNotice`)
    : undefined
  const structureTitle = t(`items.${id}.structureTitle`)
  const structureColumns = t.raw(
    `items.${id}.structureColumns`
  ) as StructureColumns
  const structureData = t.raw(
    `items.${id}.structureData`
  ) as StructureRow[]
  const deliverables = t.raw(`items.${id}.deliverables`) as string[]
  const pricingTitle = t(`items.${id}.pricingTitle`)
  const pricingColumns = t.raw(
    `items.${id}.pricingColumns`
  ) as PricingColumns
  const pricingData = t.raw(`items.${id}.pricingData`) as PricingRow[]
  const ServiceIcon = SERVICE_ICON_MAP[id]

  return (
    <main className="min-h-screen bg-brand-white text-brand-navy">
      <header className="border-b border-brand-navy/10 bg-brand-white">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/#services"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-black text-brand-navy"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-5 transition-transform group-hover:-translate-x-1"
            />
            {t('backToServices')}
          </Link>
          <span className="hidden max-w-md truncate rounded-full border border-brand-sky/20 bg-brand-sky/10 px-4 py-2 text-xs font-black tracking-[0.08em] text-brand-navy sm:block">
            {subtitle}
          </span>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-brand-navy">
        <Image
          src={`/services/${id}.jpg`}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-55"
          priority
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy via-brand-navy/88 to-brand-navy/30" />
        <div className="mx-auto flex min-h-[30rem] max-w-7xl items-end px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 text-xs font-black tracking-[0.16em] text-brand-gold uppercase">
              <ServiceIcon aria-hidden="true" className="size-4" />
              {t('eyebrow')}
            </span>
            <h1 className="mt-5 text-5xl leading-none font-black tracking-[-0.06em] text-brand-white sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 font-bold text-brand-white/75 sm:text-lg">
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
          <div className="border-l-4 border-brand-sky pl-5 sm:pl-8">
            <p className="whitespace-pre-line text-lg leading-9 font-semibold text-brand-navy/75 sm:text-xl">
              {introText}
            </p>
          </div>

          {extraNotice && (
            <aside className="bg-brand-gold p-6 text-sm leading-7 font-semibold text-brand-navy">
              <Lightbulb aria-hidden="true" className="mb-4 size-7" />
              <strong className="font-black">{t('extraNoticeLabel')}</strong>{' '}
              {extraNotice}
            </aside>
          )}
        </section>

        <section className="mt-16 border-t border-brand-navy/12 pt-12 sm:mt-24 sm:pt-16">
          <SectionTitle
            icon={ListChecks}
            eyebrow={t('structureLabel')}
            title={structureTitle}
          />
          <div className="mt-8 overflow-x-auto border border-brand-navy/14">
            <table className="w-full min-w-2xl border-collapse text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-brand-navy text-brand-white">
                  <th className="w-1/4 p-4 font-black sm:p-5">
                    {structureColumns.col1}
                  </th>
                  <th className="p-4 font-black sm:p-5">
                    {structureColumns.col2}
                  </th>
                  {structureColumns.col3 && (
                    <th className="w-1/4 p-4 font-black sm:p-5">
                      {structureColumns.col3}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/10">
                {structureData.map((row, index) => (
                  <tr
                    key={row.stage}
                    className="transition-colors odd:bg-brand-navy/[0.025] hover:bg-brand-gold/20"
                  >
                    <td className="p-4 align-top font-black whitespace-nowrap text-brand-navy sm:p-5">
                      <span className="mr-3 text-xs text-brand-sky">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {row.stage}
                    </td>
                    <td className="p-4 leading-7 font-medium text-brand-navy/70 sm:p-5">
                      {row.content}
                    </td>
                    {structureColumns.col3 && (
                      <td className="p-4 align-top font-bold whitespace-nowrap text-brand-navy/60 sm:p-5">
                        {row.duration ?? '—'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 grid gap-8 bg-brand-navy px-6 py-10 text-brand-white sm:mt-24 sm:px-10 sm:py-14 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <CheckCircle2
              aria-hidden="true"
              className="size-8 text-brand-gold"
            />
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              {t('deliverablesHeading')}
            </h2>
          </div>
          <ul className="grid gap-3">
            {deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border border-brand-white/15 bg-brand-white/5 p-4 text-base leading-7 font-semibold text-brand-white/80"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-brand-gold"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-brand-navy/12 pt-12 sm:mt-24 sm:pt-16">
          <SectionTitle
            icon={BadgeDollarSign}
            eyebrow={t('pricingLabel')}
            title={pricingTitle}
          />
          <div className="mt-8 overflow-x-auto border border-brand-navy/14">
            <table className="w-full min-w-xl border-collapse text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-brand-gold text-brand-navy">
                  <th className="w-1/3 p-4 font-black sm:p-5">
                    {pricingColumns.col1}
                  </th>
                  <th className="p-4 font-black sm:p-5">
                    {pricingColumns.col2}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/10">
                {pricingData.map((row) => (
                  <tr
                    key={row.label}
                    className="odd:bg-brand-navy/[0.025] hover:bg-brand-sky/5"
                  >
                    <td className="p-4 align-top font-black whitespace-nowrap text-brand-navy sm:p-5">
                      {row.label}
                    </td>
                    <td className="p-4 leading-7 font-medium whitespace-pre-line text-brand-navy/70 sm:p-5">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="relative mt-16 overflow-hidden bg-brand-sky p-8 text-brand-white sm:mt-24 sm:p-12">
          <CalendarDays
            aria-hidden="true"
            className="absolute -right-8 -bottom-10 size-48 text-brand-white/10"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                {t('ctaHeading')}
              </h2>
              <p className="mt-4 text-base leading-7 font-semibold text-brand-white/80">
                {t('ctaBody')}
              </p>
            </div>
            <Link
              href="/#booking"
              className="inline-flex min-h-13 shrink-0 items-center gap-2 bg-brand-gold px-6 font-black text-brand-navy transition-transform hover:-translate-y-0.5"
            >
              {t('ctaButton')}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title
}: {
  icon: typeof ListChecks
  eyebrow: string
  title: string
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center bg-brand-gold text-brand-navy">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <div>
        <p className="text-xs font-black tracking-[0.15em] text-brand-sky uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-brand-navy sm:text-4xl">
          {title}
        </h2>
      </div>
    </div>
  )
}
