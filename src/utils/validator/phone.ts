export function formatTaiwanMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  const parts = [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 10)].filter(Boolean);
  return parts.join('-');
}

export function isValidTaiwanMobile(value: string): boolean {
  return /^09\d{2}-\d{3}-\d{3}$/.test(value.trim());
}
