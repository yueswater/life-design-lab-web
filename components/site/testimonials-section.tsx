import { Quote } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SectionHeading } from './section-heading'

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const testimonials = [
    {
      id: 'shawn',
      initial: 'S',
      lead: t('shawnLead'),
      quote: t('shawnQuote'),
      attribution: t('shawnAttribution')
    },
    {
      id: 'wu',
      initial: 'W',
      lead: t('wuLead'),
      quote: t('wuQuote'),
      attribution: t('wuAttribution')
    }
  ]

  return (
    <section className="border-b border-brand-navy/10 bg-brand-white">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading eyebrow={t('heading')} title={t('closingLine2')} />

        <div className="grid gap-5 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="group relative isolate overflow-hidden border border-brand-navy/16 bg-brand-white p-6 shadow-[0_16px_48px_rgba(2,48,71,0.08)] sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 -translate-x-full bg-brand-gold transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:translate-x-0"
              />
              <div className="mb-8 flex items-center justify-between gap-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-navy text-lg font-black text-brand-white">
                  {testimonial.initial}
                </span>
                <Quote
                  aria-hidden="true"
                  className="size-9 text-brand-sky transition-transform group-hover:-rotate-6"
                />
              </div>
              <p className="mb-4 text-sm leading-6 font-bold text-brand-navy/62">
                {testimonial.lead}
              </p>
              <blockquote className="text-lg leading-8 font-bold text-brand-navy sm:text-xl">
                {testimonial.quote}
              </blockquote>
              <p className="mt-6 border-t border-brand-navy/12 pt-4 text-sm font-black text-brand-navy">
                {testimonial.attribution}
              </p>
            </article>
          ))}
        </div>

        <p className="max-w-3xl text-base leading-7 font-semibold text-brand-navy/70">
          {t('closingLine1')}
        </p>
      </div>
    </section>
  )
}
