/**
 * Date formatting with the time zone always pinned. Without `timeZone`, the server (UTC on Vercel)
 * and the browser (the visitor's zone) print different text and React throws hydration error #418.
 * Pass SITE.locale and SITE.timeZone.
 */
export function formatTime(ms: number, locale: string, timeZone: string): string {
  return new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit" }).format(ms);
}

export function formatDate(ms: number, locale: string, timeZone: string): string {
  return new Intl.DateTimeFormat(locale, { timeZone, day: "numeric", month: "short", year: "numeric" }).format(ms);
}
