import { Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  centered?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  centered = false
}: SectionHeadingProps) {
  return (
    <div className={cn('space-y-3', centered && 'text-center')}>
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-sky/20 bg-brand-sky/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-navy">
        <Sparkles aria-hidden="true" className="size-3.5" />
        {eyebrow}
      </span>
      <h2 className="text-3xl font-black tracking-[-0.035em] text-brand-navy sm:text-4xl">
        {title}
      </h2>
    </div>
  )
}
