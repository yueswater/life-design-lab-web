import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ModuleItem } from '../types';
import { CONTACT_PLATFORMS, ContactPlatformOption } from '../lib/contact-platforms';
import { toDateKey } from '../lib/appointment-slots';
import { fetchBookedSlots, createAppointment } from '../lib/appointments-api';
import { formatTaiwanMobile, isValidTaiwanMobile } from '../utils/validator/phone';
import { sanitizeLineId, isValidLineId } from '../utils/validator/lineId';
import { isValidEmail } from '../utils/validator/email';
import { Language } from '../i18n/LanguageContext';
import { Strings } from '../i18n/strings';

const MAX_BOOKING_DAYS_AHEAD = 45;

// Platforms whose contact detail is a Taiwan mobile number (09xx-xxx-xxx)
const PHONE_FORMAT_PLATFORMS = new Set<ContactPlatformOption['id']>(['phone', 'whatsapp']);

function isContactDetailValid(platformId: ContactPlatformOption['id'], value: string): boolean {
  if (PHONE_FORMAT_PLATFORMS.has(platformId)) return isValidTaiwanMobile(value);
  if (platformId === 'line') return isValidLineId(value);
  return value.length > 0; // messenger: free text, just non-empty
}

// All state and submission logic behind the booking form, independent of
// whether it's rendered inside a modal or as a standalone page.
export function useBookingForm(
  module: ModuleItem | null,
  lang: Language,
  t: Strings,
  onSuccess?: (moduleTitle: string) => void,
  onValidationError?: (message: string) => void
) {
  const [platformId, setPlatformId] = useState(CONTACT_PLATFORMS[0].id);
  const [contactDetail, setContactDetail] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const platformMenuRef = useRef<HTMLDivElement>(null);

  const platform = CONTACT_PLATFORMS.find((p) => p.id === platformId) ?? CONTACT_PLATFORMS[0];

  // Close the contact-platform dropdown on outside click
  useEffect(() => {
    if (!isPlatformOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!platformMenuRef.current?.contains(e.target as Node)) {
        setIsPlatformOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPlatformOpen]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + MAX_BOOKING_DAYS_AHEAD);
    return d;
  }, [today]);

  // Reset the form whenever it targets a different module
  useEffect(() => {
    setPlatformId(CONTACT_PLATFORMS[0].id);
    setContactDetail('');
    setName('');
    setEmail('');
    setNotes('');
    setSelectedDate(null);
    setSelectedSlot(null);
    setBookedSlots([]);
    setErrorMessage(null);
    setIsPlatformOpen(false);
  }, [module?.id]);

  // Fetch already-booked slots whenever a date is picked
  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setSlotsLoading(true);
    setSelectedSlot(null);
    fetchBookedSlots(toDateKey(selectedDate), lang)
      .then((slots) => {
        if (!cancelled) setBookedSlots(slots);
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : t.api.slotsFetchFailed);
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, lang, t]);

  const trimmedEmail = email.trim();
  const showEmailError = trimmedEmail.length > 0 && !isValidEmail(trimmedEmail);

  const trimmedContactDetail = contactDetail.trim();
  const showContactDetailError =
    trimmedContactDetail.length > 0 && !isContactDetailValid(platformId, trimmedContactDetail);

  const canSubmit = Boolean(
    module &&
      name.trim() &&
      trimmedEmail &&
      isValidEmail(trimmedEmail) &&
      trimmedContactDetail &&
      isContactDetailValid(platformId, trimmedContactDetail) &&
      selectedDate &&
      selectedSlot &&
      !submitting
  );

  const handleContactDetailChange = (value: string) => {
    if (PHONE_FORMAT_PLATFORMS.has(platformId)) {
      setContactDetail(formatTaiwanMobile(value));
    } else if (platformId === 'line') {
      setContactDetail(sanitizeLineId(value));
    } else {
      setContactDetail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      onValidationError?.(t.moduleModal.missingFields);
      return;
    }
    if (!module || !selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await createAppointment(
        {
          name: name.trim(),
          email: email.trim(),
          service: module.title[lang].split('|')[0].trim(),
          contactPlatform: platform.label.en,
          contactDetail: contactDetail.trim(),
          appointmentDate: toDateKey(selectedDate),
          slot: selectedSlot,
          notes: notes.trim() || undefined,
          lang,
        },
        lang
      );
      onSuccess?.(module.title[lang]);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.api.submitFailed;
      setErrorMessage(message);
      if (message === t.api.slotTaken) {
        // Slot was taken between selection and submit — refresh availability
        fetchBookedSlots(toDateKey(selectedDate), lang)
          .then(setBookedSlots)
          .catch(() => {});
        setSelectedSlot(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    platformId,
    setPlatformId,
    contactDetail,
    handleContactDetailChange,
    name,
    setName,
    email,
    setEmail,
    notes,
    setNotes,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    bookedSlots,
    slotsLoading,
    submitting,
    errorMessage,
    isPlatformOpen,
    setIsPlatformOpen,
    platformMenuRef,
    platform,
    today,
    maxDate,
    showEmailError,
    showContactDetailError,
    canSubmit,
    handleSubmit,
  };
}

export type BookingForm = ReturnType<typeof useBookingForm>;
