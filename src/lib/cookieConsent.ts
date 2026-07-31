export type CookieConsent = 'accepted' | 'necessary' | 'rejected';

const STORAGE_KEY = 'ldl-cookie-consent';

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === 'accepted' || value === 'necessary' || value === 'rejected' ? value : null;
}

export function setCookieConsent(value: CookieConsent): void {
  window.localStorage.setItem(STORAGE_KEY, value);
}

/** Only "accepted" allows non-essential tracking like article view counts. */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === 'accepted';
}
