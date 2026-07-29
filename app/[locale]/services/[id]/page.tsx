'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '../../../../i18n/navigation'

const SERVICE_IDS = [
  'one-on-one',
  'workshop',
  'small-group',
  'lecture'
] as const

type ServiceId = (typeof SERVICE_IDS)[number]
type StructureColumns = { col1: string; col2: string; col3?: string }
type StructureRow = { stage: string; content: string; duration?: string }
type PricingColumns = { col1: string; col2: string }
type PricingRow = { label: string; detail: string }

function isServiceId(value: string): value is ServiceId {
  return SERVICE_IDS.some((serviceId) => serviceId === value)
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = params.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const t = useTranslations('serviceDetail')

  if (!id || !isServiceId(id)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {t('notFoundTitle')}
          </h2>
          <p className="text-slate-500">{t('notFoundBody')}</p>
          <button
            onClick={() => router.push('/')}
            className="rounded-lg bg-amber-400 px-5 py-2.5 font-bold text-amber-950 shadow-sm transition hover:bg-amber-500"
          >
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
  const imageSrc = `/services/${id}.jpg`

  return (
    <main className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800 md:p-16">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="flex items-center justify-between">
          <Link
            href="/#services"
            className="group inline-flex items-center text-sm font-bold tracking-wide text-slate-600 transition hover:text-amber-600"
          >
            <span className="mr-1.5 transition-transform group-hover:-translate-x-1">
              ←
            </span>{' '}
            {t('backToServices')}
          </Link>
          <span className="rounded-full bg-amber-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-950">
            {subtitle}
          </span>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative flex h-64 w-full items-center justify-center bg-gradient-to-r from-amber-200 to-sky-200 md:h-80">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 space-y-1 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 drop-shadow">
                {t('eyebrow')}
              </span>
              <h1 className="text-3xl font-black tracking-tight drop-shadow-md md:text-5xl">
                {title}
              </h1>
            </div>
          </div>

          <div className="space-y-6 p-8 md:p-10">
            <p className="text-base leading-relaxed font-normal tracking-wide whitespace-pre-line text-slate-700 md:text-lg">
              {introText}
            </p>
            {extraNotice && (
              <div className="rounded-r-xl border-l-4 border-amber-400 bg-amber-50/90 p-5 text-sm leading-relaxed font-medium text-slate-800 md:text-base">
                💡{' '}
                <span className="font-bold text-slate-900">
                  {t('extraNoticeLabel')}
                </span>{' '}
                {extraNotice}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="space-y-1">
            <span className="rounded bg-amber-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest text-amber-900">
              {t('structureLabel')}
            </span>
            <h2 className="border-l-4 border-amber-400 pl-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              {structureTitle}
            </h2>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full border-collapse overflow-hidden rounded-xl border border-slate-200 text-left text-sm md:text-base">
              <thead>
                <tr className="bg-amber-100/90 font-bold tracking-wide text-amber-950">
                  <th className="w-1/4 border-b border-slate-200 p-4">
                    {structureColumns.col1}
                  </th>
                  <th className="border-b border-slate-200 p-4">
                    {structureColumns.col2}
                  </th>
                  {structureColumns.col3 && (
                    <th className="w-1/4 border-b border-slate-200 p-4">
                      {structureColumns.col3}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {structureData.map((row) => (
                  <tr
                    key={row.stage}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="p-4 font-bold whitespace-nowrap text-slate-900">
                      {row.stage}
                    </td>
                    <td className="p-4 leading-relaxed text-slate-700">
                      {row.content}
                    </td>
                    {row.duration && (
                      <td className="p-4 font-medium whitespace-nowrap text-slate-600">
                        {row.duration}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h2 className="border-l-4 border-amber-400 pl-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            {t('deliverablesHeading')}
          </h2>
          <ul className="space-y-3 pt-2">
            {deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start space-x-3 text-base leading-relaxed font-normal text-slate-700 md:text-lg"
              >
                <span className="text-lg font-bold text-amber-500 select-none">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="space-y-1">
            <span className="rounded bg-amber-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest text-amber-900">
              {t('pricingLabel')}
            </span>
            <h2 className="border-l-4 border-amber-400 pl-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              {pricingTitle}
            </h2>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full border-collapse overflow-hidden rounded-xl border border-slate-200 text-left text-sm md:text-base">
              <thead>
                <tr className="bg-amber-100/90 font-bold tracking-wide text-amber-950">
                  <th className="w-1/3 border-b border-slate-200 p-4">
                    {pricingColumns.col1}
                  </th>
                  <th className="border-b border-slate-200 p-4">
                    {pricingColumns.col2}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pricingData.map((row) => (
                  <tr
                    key={row.label}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="p-4 align-top font-bold whitespace-nowrap text-slate-900">
                      {row.label}
                    </td>
                    <td className="p-4 leading-relaxed whitespace-pre-line text-slate-700">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col items-center justify-between gap-6 rounded-r-2xl border-l-4 border-amber-400 bg-amber-100/90 p-8 shadow-sm md:flex-row md:p-10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              {t('ctaHeading')}
            </h3>
            <p className="text-sm font-medium text-slate-700 md:text-base">
              {t('ctaBody')}
            </p>
          </div>
          <Link
            href="/#booking"
            className="rounded-xl bg-amber-400 px-7 py-3.5 text-base font-bold whitespace-nowrap text-amber-950 shadow-sm transition hover:bg-amber-500"
          >
            {t('ctaButton')}
          </Link>
        </section>
      </div>
    </main>
  )
}
