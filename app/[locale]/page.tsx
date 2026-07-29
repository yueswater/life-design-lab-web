'use client'

import { useEffect, useState } from 'react'
import { useFormatter, useLocale, useTranslations } from 'next-intl'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Image from 'next/image'
import { Link } from '../../i18n/navigation'
import {
  createAppointment,
  getBookedSlots,
  getPosts,
  type Post
} from '../../lib/api'

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00'
]

const SERVICE_IDS = [
  'one-on-one',
  'workshop',
  'small-group',
  'lecture'
] as const

type ServiceId = (typeof SERVICE_IDS)[number]

const SERVICE_STYLES: Record<
  ServiceId,
  {
    headerBg: string
    headerText: string
    tagBg: string
    tagText: string
  }
> = {
  'one-on-one': {
    headerBg: 'bg-amber-400',
    headerText: 'text-amber-950',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-900'
  },
  workshop: {
    headerBg: 'bg-amber-400',
    headerText: 'text-amber-950',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-900'
  },
  'small-group': {
    headerBg: 'bg-amber-400',
    headerText: 'text-amber-950',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-900'
  },
  lecture: {
    headerBg: 'bg-amber-400',
    headerText: 'text-amber-950',
    tagBg: 'bg-sky-100',
    tagText: 'text-sky-900'
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export default function Home() {
  const t = useTranslations()
  const locale = useLocale()
  const format = useFormatter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPlatform: 'Line ID',
    contactDetail: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    void fetchPosts()
  }, [])

  useEffect(() => {
    void fetchBookedSlots(selectedDate)
  }, [selectedDate])

  async function fetchPosts() {
    try {
      setLoadingPosts(true)
      setPosts(await getPosts())
    } catch (error: unknown) {
      console.error('failed to fetch posts:', getErrorMessage(error))
    } finally {
      setLoadingPosts(false)
    }
  }

  async function fetchBookedSlots(date: Date) {
    try {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      setBookedSlots(await getBookedSlots(`${year}-${month}-${day}`))
    } catch (error: unknown) {
      setBookedSlots([])
      console.error('failed to fetch booked slots:', getErrorMessage(error))
    }
  }

  async function handleSubmitAppointment(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    if (!selectedSlot) {
      setSubmitMessage(t('booking.msgPickSlotFirst'))
      setIsSubmitting(false)
      return
    }

    try {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')

      await createAppointment({
        name: formData.name,
        email: formData.email,
        contactPlatform: formData.contactPlatform,
        contactDetail: formData.contactDetail,
        notes: formData.notes,
        appointmentDate: `${year}-${month}-${day}`,
        slot: selectedSlot
      })

      setSubmitMessage(t('booking.msgSuccess'))
      setFormData({
        name: '',
        email: '',
        contactPlatform: 'Line ID',
        contactDetail: '',
        notes: ''
      })
      setSelectedSlot('')
      void fetchBookedSlots(selectedDate)
    } catch (error: unknown) {
      const message = getErrorMessage(error)

      if (message === 'slot already booked') {
        setSubmitMessage(t('booking.msgSlotTaken'))
        void fetchBookedSlots(selectedDate)
      } else {
        setSubmitMessage(t('booking.msgFailure', { message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDateChange(value: Date | null | [Date | null, Date | null]) {
    if (value instanceof Date) {
      setSelectedDate(value)
      setSelectedSlot('')
    }
  }

  function getPlaceholder() {
    switch (formData.contactPlatform) {
      case 'Line ID':
        return t('booking.placeholderLine')
      case 'IG 帳號':
        return t('booking.placeholderIg')
      case 'FB 連結':
        return t('booking.placeholderFb')
      default:
        return t('booking.placeholderDefault')
    }
  }

  function getContactPlatformLabel() {
    switch (formData.contactPlatform) {
      case 'Line ID':
        return t('booking.platformLine')
      case 'IG 帳號':
        return t('booking.platformIg')
      case 'FB 連結':
        return t('booking.platformFb')
      default:
        return t('booking.contactPlatformLabel')
    }
  }

  const formattedDate = format.dateTime(selectedDate, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800 md:p-16">
      <div className="mx-auto max-w-5xl space-y-20">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-slate-50/90 pb-4 backdrop-blur">
          <h1 className="text-2xl font-bold tracking-wide text-slate-900">
            Life Design Lab
          </h1>
          <nav className="space-x-4 text-sm font-medium text-slate-600 md:space-x-6">
            <a href="#intro" className="transition hover:text-amber-600">
              {t('nav.intro')}
            </a>
            <a href="#services" className="transition hover:text-amber-600">
              {t('nav.services')}
            </a>
            <a href="#blog" className="transition hover:text-amber-600">
              {t('nav.blog')}
            </a>
            <a
              href="#booking"
              className="rounded-lg bg-amber-300 px-3.5 py-1.5 font-bold text-amber-950 shadow-sm transition hover:bg-amber-500"
            >
              {t('nav.bookingCta')}
            </a>
            <a href="#about" className="transition hover:text-amber-600">
              {t('nav.about')}
            </a>
          </nav>
        </header>

        <section
          id="intro"
          className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12"
        >
          <div className="space-y-4">
            <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-sm font-bold uppercase tracking-wider text-amber-900">
              {t('intro.label')}
            </span>
            <h2 className="text-3xl font-extrabold leading-relaxed text-slate-900">
              {t('intro.headingPrimary')}{' '}
              <span className="text-slate-900 underline decoration-4 decoration-amber-400">
                {t('intro.headingAccent')}
              </span>
            </h2>
            <p className="text-base leading-relaxed text-slate-700 md:text-lg">
              {t('intro.body')}
            </p>
            <div className="rounded-r-xl border-l-4 border-amber-400 bg-amber-100/80 p-5 text-sm leading-relaxed text-slate-900 md:text-base">
              {t.rich('intro.highlight', {
                hl: (chunks) => (
                  <b className="bg-amber-200 px-1 text-slate-900">{chunks}</b>
                )
              })}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('testimonials.heading')}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">
                  {t('testimonials.shawnLead')}
                </p>
                <blockquote className="my-2 border-l-2 border-amber-400 pl-3 text-sm font-semibold italic text-slate-800">
                  {t('testimonials.shawnQuote')}
                </blockquote>
                <p className="text-right text-xs font-bold text-slate-900">
                  {t('testimonials.shawnAttribution')}
                </p>
              </div>
              <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">
                  {t('testimonials.wuLead')}
                </p>
                <blockquote className="my-2 border-l-2 border-amber-400 pl-3 text-sm font-semibold italic text-slate-800">
                  {t('testimonials.wuQuote')}
                </blockquote>
                <p className="text-right text-xs font-bold text-slate-900">
                  {t('testimonials.wuAttribution')}
                </p>
              </div>
            </div>
            <p className="pt-2 text-center text-sm font-medium text-slate-700">
              {t('testimonials.closingLine1')}
              <br className="hidden md:inline" />
              <span className="mt-1 inline-block rounded bg-amber-100 px-2.5 py-1 font-bold text-slate-900">
                {t('testimonials.closingLine2')}
              </span>
            </p>
          </div>
        </section>

        <section id="services" className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-sm font-bold uppercase tracking-wider text-amber-900">
                {t('services.label')}
              </span>
              <h3 className="mt-2 border-l-4 border-amber-400 pl-3 text-2xl font-bold text-slate-900 md:text-3xl">
                {t('services.heading')}
              </h3>
            </div>
            <p className="hidden text-sm text-slate-500 md:block">
              {t('services.hint')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_IDS.map((id) => {
              const style = SERVICE_STYLES[id]
              const url = `/services/${id}`

              return (
                <div
                  key={id}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-300 hover:shadow-md"
                >
                  <div>
                    <Link href={url} className="group block">
                      <div
                        className={`flex h-24 cursor-pointer flex-col justify-end p-4 transition group-hover:bg-amber-500 ${style.headerBg} ${style.headerText}`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                          {t(`services.items.${id}.subtitle`)}
                        </span>
                        <h4 className="text-lg font-bold">
                          {t(`services.items.${id}.title`)} →
                        </h4>
                      </div>
                    </Link>
                    <div className="space-y-3 p-5">
                      <span
                        className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold ${style.tagBg} ${style.tagText}`}
                      >
                        {t(`services.items.${id}.tag`)}
                      </span>
                      <p className="text-xs leading-relaxed text-slate-600 md:text-sm">
                        {t(`services.items.${id}.desc`)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 p-5 pt-0">
                    <Link
                      href={url}
                      className="block cursor-pointer rounded-lg bg-slate-100 py-2.5 text-center text-xs font-bold text-slate-800 transition hover:bg-slate-200"
                    >
                      {t('services.viewDetail')}
                    </Link>
                    <a
                      href="#booking"
                      className="block rounded-lg bg-amber-400 py-2 text-center text-xs font-bold text-amber-950 shadow-sm transition hover:bg-amber-500"
                    >
                      {t('services.bookNow')}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section id="blog" className="space-y-6">
          <h3 className="border-l-4 border-amber-400 pl-3 text-2xl font-bold text-slate-900">
            {t('blog.heading')}
          </h3>
          {loadingPosts ? (
            <p className="text-slate-400">{t('blog.loading')}</p>
          ) : posts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
              {t('blog.empty')}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-300"
                >
                  <h4 className="text-xl font-bold text-slate-900">
                    {post.title}
                  </h4>
                  <p className="line-clamp-3 text-sm text-slate-600">
                    {post.content}
                  </p>
                  <span className="block text-xs text-slate-400">
                    {format.dateTime(new Date(post.created_at))}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section
          id="booking"
          className="space-y-6 rounded-2xl border-2 border-amber-300 bg-white p-8 shadow-sm md:p-10"
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-950">
                {t('booking.badge')}
              </span>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-sm font-bold text-slate-900">
                {t('booking.tagline')}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
              {t('booking.heading')}
            </h3>
            <p className="text-sm text-slate-600 md:text-base">
              {t('booking.description')}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-600">
              {[t('booking.perk1'), t('booking.perk2'), t('booking.perk3')].map(
                (perk) => (
                  <div key={perk} className="flex items-center space-x-1.5">
                    <span className="font-bold text-sky-500">✓</span>
                    <span>{perk}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">
                  {t('booking.step1')}
                </label>
                <div className="flex justify-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={new Date()}
                    locale={locale}
                    className="rounded-lg border-none bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">
                  {t('booking.step2', { date: formattedDate })}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot)
                    const isSelected = selectedSlot === slot

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg px-2 py-2 text-xs font-semibold transition-all md:text-sm ${
                          isBooked
                            ? 'cursor-not-allowed bg-slate-100 text-slate-400 line-through'
                            : isSelected
                              ? 'bg-sky-500 font-bold text-white shadow-md'
                              : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                        }`}
                      >
                        {slot} {isBooked ? t('booking.slotFull') : ''}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmitAppointment}
              className="flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-900">
                  {t('booking.step3')}
                </label>
                <div className="rounded-lg border border-amber-200 bg-amber-100/80 p-3 text-sm text-slate-900">
                  {t('booking.selectedDateLabel')}{' '}
                  <span className="font-bold">{formattedDate}</span>
                  {selectedSlot ? (
                    <span className="ml-2 rounded bg-amber-300 px-2 py-0.5 font-bold text-amber-950">
                      {selectedSlot} {t('booking.durationSuffix')}
                    </span>
                  ) : (
                    <span className="ml-2 text-slate-400">
                      {t('booking.pickSlotHint')}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('booking.nameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder={t('booking.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('booking.emailLabel')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder={t('booking.emailPlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {t('booking.contactPlatformLabel')}
                    </label>
                    <select
                      value={formData.contactPlatform}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          contactPlatform: event.target.value
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Line ID">{t('booking.platformLine')}</option>
                      <option value="IG 帳號">{t('booking.platformIg')}</option>
                      <option value="FB 連結">{t('booking.platformFb')}</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {getContactPlatformLabel()}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactDetail}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          contactDetail: event.target.value
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                      placeholder={getPlaceholder()}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('booking.notesLabel')}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(event) =>
                      setFormData({ ...formData, notes: event.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder={t('booking.notesPlaceholder')}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSlot}
                  className="w-full rounded-lg bg-amber-400 py-3.5 text-base font-bold text-amber-950 shadow-md transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? t('booking.submitting')
                    : t('booking.submitCta')}
                </button>
                {submitMessage && (
                  <p
                    className={`mt-3 text-center text-sm font-bold ${
                      submitMessage.includes('🎉')
                        ? 'text-emerald-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {submitMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>

        <section
          id="about"
          className="space-y-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12"
        >
          <div className="grid items-start gap-8 md:grid-cols-12">
            <div className="space-y-4 text-center md:col-span-5 md:text-left">
              <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-full border-4 border-amber-300 bg-amber-50 shadow-md md:mx-0">
                <Image
                  src="/mindsay-avatar.png"
                  alt="Min YANG"
                  fill
                  sizes="224px"
                  className="object-cover"
                  priority
                />
              </div>
              <p className="text-sm font-semibold leading-relaxed text-slate-700">
                {t('about.roles')}
              </p>
            </div>
            <div className="space-y-4 md:col-span-7">
              <h3 className="border-l-4 border-amber-400 pl-3 text-2xl font-extrabold tracking-wide text-slate-900 md:text-3xl">
                {t('about.name')}
              </h3>
              <ul className="list-inside list-disc space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">
                {(t.raw('about.bullets') as string[]).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-6">
            <blockquote className="rounded-r-lg border-l-4 border-amber-400 bg-amber-100/80 p-4 text-base font-bold text-slate-900 md:text-lg">
              {t('about.quote')}
            </blockquote>
            <div className="space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">
              <p>{t('about.paragraph1')}</p>
              <p>{t('about.paragraph2')}</p>
              <div className="flex items-center space-x-2 pt-2 text-sm">
                <span>{t('about.igLine')}</span>
                <a
                  href="https://www.instagram.com/mindsayseverything"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded bg-sky-200 px-3 py-1 font-mono text-xs font-bold text-slate-900 shadow-sm transition hover:bg-sky-500"
                >
                  @mindsayseverything
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-8 pb-12 text-center text-xs text-slate-400">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </footer>
      </div>
    </main>
  )
}
