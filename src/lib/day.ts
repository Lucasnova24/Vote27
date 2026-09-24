// Shared "what day is it in Paris" helper. Anything that resets at midnight
// Europe/Paris (the daily vote, the daily quiz, and — built on top of this —
// the weekly first-round pick in lib/week.ts) keys its rows off this date.
const PARIS_DAY = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' })

export function parisDate(date: Date): Date {
  const p: Record<string, string> = {}
  PARIS_DAY.formatToParts(date).forEach((x) => { p[x.type] = x.value })
  return new Date(Number(p.year), Number(p.month) - 1, Number(p.day))
}

export function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Today's date on the Paris calendar, as 'YYYY-MM-DD' — the period key for
// the daily vote and daily quiz, matching the server-side default on
// votes.vote_date / quiz_attempts.quiz_date.
export function currentDayStart(date = new Date()): string {
  return isoDay(parisDate(date))
}
