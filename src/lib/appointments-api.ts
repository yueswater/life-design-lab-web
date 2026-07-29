import { Language } from '../i18n/LanguageContext';
import { getStrings } from '../i18n/strings';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface AppointmentPayload {
  name: string;
  email: string;
  service: string;
  contactPlatform: string;
  contactDetail: string;
  appointmentDate: string; // YYYY-MM-DD
  slot: string; // HH:mm, 09:00..20:00
  notes?: string;
  lang: Language;
}

export async function fetchBookedSlots(date: string, lang: Language): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/appointments?date=${date}`);
  if (!response.ok) {
    throw new Error(getStrings(lang).api.slotsFetchFailed);
  }
  return response.json();
}

export async function createAppointment(
  payload: AppointmentPayload,
  lang: Language
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    throw new Error(getStrings(lang).api.slotTaken);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      typeof body?.error === 'string' ? body.error : getStrings(lang).api.submitFailed
    );
  }
}
