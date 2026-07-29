'use client'

import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  LoaderCircle,
  MessagesSquare,
  Send,
  ShieldCheck
} from 'lucide-react'
import { useFormatter, useLocale, useTranslations } from 'next-intl'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { SectionHeading } from './section-heading'

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

export type BookingFormData = {
  name: string
  email: string
  contactPlatform: string
  contactDetail: string
  notes: string
}

type CalendarValue = Date | null | [Date | null, Date | null]

type BookingSectionProps = {
  selectedDate: Date
  selectedSlot: string
  bookedSlots: string[]
  formData: BookingFormData
  isSubmitting: boolean
  submitMessage: string
  onDateChange: (value: CalendarValue) => void
  onSlotChange: (slot: string) => void
  onFormDataChange: (value: BookingFormData) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export function BookingSection({
  selectedDate,
  selectedSlot,
  bookedSlots,
  formData,
  isSubmitting,
  submitMessage,
  onDateChange,
  onSlotChange,
  onFormDataChange,
  onSubmit
}: BookingSectionProps) {
  const t = useTranslations('booking')
  const locale = useLocale()
  const format = useFormatter()
  const formattedDate = format.dateTime(selectedDate, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  const isSuccess = submitMessage === t('msgSuccess')

  function getPlaceholder() {
    switch (formData.contactPlatform) {
      case 'Line ID':
        return t('placeholderLine')
      case 'IG 帳號':
        return t('placeholderIg')
      case 'FB 連結':
        return t('placeholderFb')
      default:
        return t('placeholderDefault')
    }
  }

  function getContactPlatformLabel() {
    switch (formData.contactPlatform) {
      case 'Line ID':
        return t('platformLine')
      case 'IG 帳號':
        return t('platformIg')
      case 'FB 連結':
        return t('platformFb')
      default:
        return t('contactPlatformLabel')
    }
  }

  return (
    <section
      id="booking"
      className="site-section relative overflow-hidden border-b border-brand-navy/10 bg-brand-sky"
    >
      <div
        aria-hidden="true"
        className="absolute -top-36 -right-24 size-96 rounded-full border-[56px] border-brand-gold/25"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="[&_*]:text-brand-white [&_span]:border-brand-white/25 [&_span]:bg-brand-white/10">
            <SectionHeading eyebrow={t('badge')} title={t('heading')} />
          </div>
          <p className="max-w-lg text-sm leading-7 font-semibold text-brand-white/80 lg:text-right">
            {t('description')}
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            [ShieldCheck, t('perk1')],
            [MessagesSquare, t('perk2')],
            [CheckCircle2, t('perk3')]
          ].map(([Icon, perk]) => (
            <div
              key={String(perk)}
              className="flex items-center gap-3 border border-brand-white/20 bg-brand-white/10 p-4 text-sm font-bold text-brand-white backdrop-blur"
            >
              <Icon
                aria-hidden="true"
                className="size-5 shrink-0 text-brand-gold"
              />
              {String(perk)}
            </div>
          ))}
        </div>

        <div className="grid overflow-hidden bg-brand-white shadow-[0_32px_90px_rgba(2,48,71,0.28)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-brand-navy/10 bg-brand-navy/[0.025] p-5 sm:p-8 lg:border-r lg:border-b-0">
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-black text-brand-navy">
                  <CalendarDays
                    aria-hidden="true"
                    className="size-5 text-brand-sky"
                  />
                  {t('step1')}
                </h3>
                <div className="overflow-hidden border border-brand-navy/15 bg-brand-white p-2 [&_.react-calendar]:w-full [&_.react-calendar]:border-0 [&_.react-calendar]:font-sans [&_.react-calendar__month-view__days__day--weekend]:text-brand-sky [&_.react-calendar__navigation_button]:font-bold [&_.react-calendar__tile--active]:bg-brand-sky! [&_.react-calendar__tile--active]:text-brand-white! [&_.react-calendar__tile--now]:bg-brand-gold! [&_.react-calendar__tile:enabled:hover]:bg-brand-gold/50!">
                  <Calendar
                    onChange={onDateChange}
                    value={selectedDate}
                    minDate={new Date()}
                    locale={locale}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-black text-brand-navy">
                  <Clock3
                    aria-hidden="true"
                    className="size-5 text-brand-sky"
                  />
                  {t('step2', { date: formattedDate })}
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot)
                    const isSelected = selectedSlot === slot

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => onSlotChange(slot)}
                        className={`min-h-11 border px-2 text-sm font-black transition-colors ${
                          isBooked
                            ? 'cursor-not-allowed border-brand-navy/5 bg-brand-navy/5 text-brand-navy/30 line-through'
                            : isSelected
                              ? 'border-brand-sky bg-brand-sky text-brand-white'
                              : 'border-brand-navy/12 bg-brand-white text-brand-navy hover:border-brand-gold hover:bg-brand-gold/35'
                        }`}
                      >
                        {slot}
                        {isBooked ? ` ${t('slotFull')}` : ''}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col p-5 sm:p-8">
            <h3 className="mb-4 flex items-center gap-2 text-base font-black text-brand-navy">
              <MessagesSquare
                aria-hidden="true"
                className="size-5 text-brand-sky"
              />
              {t('step3')}
            </h3>

            <div className="mb-6 border-l-4 border-brand-gold bg-brand-gold/25 p-4 text-sm font-semibold text-brand-navy">
              {t('selectedDateLabel')}{' '}
              <strong>{formattedDate}</strong>
              {selectedSlot ? (
                <span className="ml-2 inline-flex bg-brand-gold px-2 py-1 font-black">
                  {selectedSlot} {t('durationSuffix')}
                </span>
              ) : (
                <span className="ml-2 text-brand-navy/50">
                  {t('pickSlotHint')}
                </span>
              )}
            </div>

            <div className="grid flex-1 gap-5">
              <Field label={t('nameLabel')}>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) =>
                    onFormDataChange({
                      ...formData,
                      name: event.target.value
                    })
                  }
                  className={inputClassName}
                  placeholder={t('namePlaceholder')}
                />
              </Field>

              <Field label={t('emailLabel')}>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    onFormDataChange({
                      ...formData,
                      email: event.target.value
                    })
                  }
                  className={inputClassName}
                  placeholder={t('emailPlaceholder')}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-[0.42fr_0.58fr]">
                <Field label={t('contactPlatformLabel')}>
                  <select
                    value={formData.contactPlatform}
                    onChange={(event) =>
                      onFormDataChange({
                        ...formData,
                        contactPlatform: event.target.value
                      })
                    }
                    className={`${inputClassName} bg-brand-white`}
                  >
                    <option value="Line ID">{t('platformLine')}</option>
                    <option value="IG 帳號">{t('platformIg')}</option>
                    <option value="FB 連結">{t('platformFb')}</option>
                  </select>
                </Field>
                <Field label={getContactPlatformLabel()}>
                  <input
                    type="text"
                    required
                    value={formData.contactDetail}
                    onChange={(event) =>
                      onFormDataChange({
                        ...formData,
                        contactDetail: event.target.value
                      })
                    }
                    className={inputClassName}
                    placeholder={getPlaceholder()}
                  />
                </Field>
              </div>

              <Field label={t('notesLabel')}>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(event) =>
                    onFormDataChange({
                      ...formData,
                      notes: event.target.value
                    })
                  }
                  className={`${inputClassName} resize-y`}
                  placeholder={t('notesPlaceholder')}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedSlot}
              className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 bg-brand-gold px-5 text-base font-black text-brand-navy transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-5 animate-spin"
                />
              ) : (
                <Send aria-hidden="true" className="size-5" />
              )}
              {isSubmitting ? t('submitting') : t('submitCta')}
            </button>

            {submitMessage && (
              <div
                role="status"
                className={`mt-4 flex items-start justify-center gap-2 p-3 text-center text-sm font-bold ${
                  isSuccess
                    ? 'bg-brand-sky/10 text-brand-sky'
                    : 'bg-brand-gold/30 text-brand-navy'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0"
                  />
                ) : (
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0"
                  />
                )}
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

const inputClassName =
  'min-h-11 w-full border border-brand-navy/18 bg-brand-white px-3 py-2 text-sm font-medium text-brand-navy outline-none placeholder:text-brand-navy/35 focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20'

function Field({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-brand-navy">
      {label}
      {children}
    </label>
  )
}
