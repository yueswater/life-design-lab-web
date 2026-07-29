/** Strips anything that isn't a letter or digit, live as the user types. */
export function sanitizeLineId(raw: string): string {
  return raw.replace(/[^A-Za-z0-9]/g, '');
}

export function isValidLineId(value: string): boolean {
  return /^[A-Za-z0-9]+$/.test(value.trim());
}
