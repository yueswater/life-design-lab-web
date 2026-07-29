import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function SiteFooter() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-brand-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/icon.svg"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-lg"
          />
          <span className="font-black text-brand-navy">Life Design Lab</span>
        </div>
        <p className="text-xs font-semibold text-brand-navy/55">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
