import { BookOpen, FileText, LoaderCircle } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import type { Post } from '../../lib/api'
import { SectionHeading } from './section-heading'

export function ArticlesSection({
  posts,
  loading
}: {
  posts: Post[]
  loading: boolean
}) {
  const t = useTranslations('blog')
  const format = useFormatter()

  return (
    <section
      id="blog"
      className="site-section border-b border-brand-navy/10 bg-brand-white"
    >
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading eyebrow={t('heading')} title={t('heading')} />

        {loading ? (
          <div className="flex min-h-44 items-center justify-center gap-3 border border-brand-navy/12 bg-brand-sky/5 text-sm font-bold text-brand-navy/65">
            <LoaderCircle
              aria-hidden="true"
              className="size-5 animate-spin text-brand-sky"
            />
            {t('loading')}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center gap-3 border border-dashed border-brand-navy/20 bg-brand-navy/[0.025] p-8 text-center">
            <FileText
              aria-hidden="true"
              className="size-8 text-brand-sky"
            />
            <p className="text-sm font-bold text-brand-navy/65">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group border border-brand-navy/14 bg-brand-white p-6 transition-transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(2,48,71,0.10)] sm:p-7"
              >
                <div className="mb-8 flex items-center justify-between">
                  <BookOpen
                    aria-hidden="true"
                    className="size-6 text-brand-sky"
                  />
                  <time className="text-xs font-black tracking-[0.1em] text-brand-navy/45 uppercase">
                    {format.dateTime(new Date(post.created_at), {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <h3 className="text-xl font-black tracking-[-0.025em] text-brand-navy group-hover:text-brand-sky">
                  {post.title}
                </h3>
                <p className="mt-4 line-clamp-5 whitespace-pre-line text-sm leading-7 font-medium text-brand-navy/68">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
