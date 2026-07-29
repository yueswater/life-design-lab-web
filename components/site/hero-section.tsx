import { Compass, Layers3, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'

const FEATURE_ICONS = [Compass, Layers3, RefreshCw] as const

export function HeroSection() {
  const t = useTranslations('intro')
  const features = t.raw('features') as string[]
  const primaryHeading = t('headingPrimary')

  return (
    <section
      id="intro"
      className="site-section relative overflow-hidden border-b border-brand-navy/10"
    >
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-28 size-80 rounded-full bg-brand-gold/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 size-80 rounded-full bg-brand-sky/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-sky/20 bg-brand-sky/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-brand-navy">
            <Compass aria-hidden="true" className="size-3.5" />
            {t('label')}
          </span>
          <h1 className="max-w-4xl text-5xl leading-[0.95] font-black tracking-[-0.065em] text-brand-navy sm:text-6xl lg:text-7xl">
            {primaryHeading && (
              <>
                {primaryHeading}
                <br />
              </>
            )}
            <span className="bg-gradient-to-r from-brand-navy via-brand-sky to-brand-sky bg-clip-text text-transparent">
              {t('headingAccent')}
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-8 font-medium text-brand-navy/72 sm:text-lg">
            {t('body')}
          </p>
        </div>

        <div className="relative border border-brand-navy/12 bg-brand-white p-6 shadow-[20px_20px_0_0_#FFDF65] sm:p-8">
          <div className="absolute top-0 left-0 h-1 w-2/5 bg-brand-sky" />
          <p className="text-base leading-8 text-brand-navy/78 sm:text-lg">
            {t.rich('highlight', {
              hl: (chunks) => (
                <strong className="bg-brand-gold px-1.5 py-0.5 font-black text-brand-navy">
                  {chunks}
                </strong>
              )
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          {features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index] ?? Compass

            return (
              <div
                key={feature}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-navy/12 bg-brand-gold/45 px-4 text-sm font-black text-brand-navy"
              >
                <Icon aria-hidden="true" className="size-4" />
                {feature}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
