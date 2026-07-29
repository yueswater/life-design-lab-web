import React from 'react';
import Calendar from 'react-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import { CONTACT_PLATFORMS } from '../../lib/contact-platforms';
import { APPOINTMENT_SLOTS } from '../../lib/appointment-slots';
import { Language } from '../../i18n/LanguageContext';
import { Strings } from '../../i18n/strings';
import type { BookingForm } from '../../hooks/useBookingForm';

interface BookingFormFieldsProps {
  form: BookingForm;
  lang: Language;
  t: Strings;
}

// Small top-right asterisk marking a required field's label.
const Required: React.FC = () => (
  <sup aria-hidden="true" className="ml-0.5 text-[10px] font-bold leading-none text-red-500">
    *
  </sup>
);

// Pure presentation for the booking fields (contact method, name/email, date,
// time slot, notes). Both the module modal and the standalone booking page
// render this against their own useBookingForm() instance and supply their
// own submit/cancel actions around it.
export const BookingFormFields: React.FC<BookingFormFieldsProps> = ({ form, lang, t }) => {
  const contactDetailErrorMessage =
    form.platformId === 'line' ? t.moduleModal.lineError : t.moduleModal.phoneError;

  return (
    <div className="space-y-4 text-xs">
      {/* Contact Platform + Detail, side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative" ref={form.platformMenuRef}>
          <label className="block font-semibold text-slate-700 mb-1.5">
            {t.moduleModal.contactPlatform}
            <Required />
          </label>
          <button
            type="button"
            onClick={() => form.setIsPlatformOpen((open) => !open)}
            aria-expanded={form.isPlatformOpen}
            className="h-[42px] w-full flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
          >
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={form.platform.icon} className="h-4 w-4 shrink-0 text-[#023047]" />
              <span className="truncate font-semibold">{form.platform.label[lang]}</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${form.isPlatformOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {form.isPlatformOpen && (
            <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
              {CONTACT_PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    form.setPlatformId(p.id);
                    form.setIsPlatformOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left cursor-pointer transition-colors ${
                    form.platformId === p.id ? 'bg-[#FBD634]/20' : 'hover:bg-slate-50'
                  }`}
                >
                  <FontAwesomeIcon icon={p.icon} className="h-4 w-4 text-[#023047]" />
                  <span className="flex-1 font-semibold text-slate-800">{p.label[lang]}</span>
                  {form.platformId === p.id && <Check className="h-4 w-4 text-[#023047]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            {t.moduleModal.contactDetailLabel(form.platform.label[lang])}
            <Required />
          </label>
          <input
            type="text"
            required
            value={form.contactDetail}
            onChange={(e) => form.handleContactDetailChange(e.target.value)}
            placeholder={form.platform.placeholder[lang]}
            aria-invalid={form.showContactDetailError}
            className={`h-[42px] w-full bg-slate-50 border rounded-xl px-3.5 text-slate-800 focus:outline-none focus:ring-2 ${
              form.showContactDetailError
                ? 'border-red-300 focus:ring-red-300'
                : 'border-slate-200 focus:ring-[#FBD634]'
            }`}
          />
          {form.showContactDetailError && (
            <p className="mt-1 text-[11px] font-semibold text-red-600">{contactDetailErrorMessage}</p>
          )}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            {t.moduleModal.nameLabel}
            <Required />
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
            placeholder={t.moduleModal.namePlaceholder}
            className="h-[42px] w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            {t.moduleModal.emailLabel}
            <Required />
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => form.setEmail(e.target.value)}
            placeholder={t.moduleModal.emailPlaceholder}
            aria-invalid={form.showEmailError}
            className={`h-[42px] w-full bg-slate-50 border rounded-xl px-3.5 text-slate-800 focus:outline-none focus:ring-2 ${
              form.showEmailError
                ? 'border-red-300 focus:ring-red-300'
                : 'border-slate-200 focus:ring-[#FBD634]'
            }`}
          />
          {form.showEmailError && (
            <p className="mt-1 text-[11px] font-semibold text-red-600">{t.moduleModal.emailError}</p>
          )}
        </div>
      </div>

      {/* Date Picker */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1.5">
          {t.moduleModal.dateLabel}
          <Required />
        </label>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
          <Calendar
            className="ldl-calendar"
            onChange={(value) => form.setSelectedDate(value as Date)}
            value={form.selectedDate}
            minDate={form.today}
            maxDate={form.maxDate}
            minDetail="month"
            next2Label={null}
            prev2Label={null}
            locale={t.moduleModal.calendarLocale}
            formatDay={(_, date) => String(date.getDate())}
            formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'narrow' })}
          />
        </div>
      </div>

      {/* Slot Picker */}
      {form.selectedDate && (
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            {t.moduleModal.slotLabel}
            <Required />
          </label>
          {form.slotsLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t.moduleModal.slotsLoading}</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {APPOINTMENT_SLOTS.map((slot) => {
                const isBooked = form.bookedSlots.includes(slot);
                const isActive = form.selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => form.setSelectedSlot(slot)}
                    className={`rounded-xl border py-2 text-center font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed ${
                      isActive
                        ? 'border-[#023047] bg-[#023047] text-white'
                        : isBooked
                          ? 'border-slate-100 bg-slate-50 text-slate-300 line-through'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#023047]'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">{t.moduleModal.notesLabel}</label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => form.setNotes(e.target.value)}
          placeholder={t.moduleModal.notesPlaceholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBD634] resize-none"
        />
      </div>

      {form.errorMessage && (
        <p className="flex items-start gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 font-semibold text-red-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{form.errorMessage}</span>
        </p>
      )}
    </div>
  );
};
