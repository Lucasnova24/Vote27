// Real dates for the 2027 French presidential election, replacing the
// original prototype's fixed fictional "today" (jeudi 15 avril / J-3).
export const FIRST_ROUND_DATE = new Date('2027-04-18T00:00:00')
export const SECOND_ROUND_DATE = new Date('2027-05-02T00:00:00')

function startOfDay(d: Date): Date {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

export function daysUntil(target: Date, from: Date = new Date()): number {
  const ms = startOfDay(target).getTime() - startOfDay(from).getTime()
  return Math.round(ms / 86400000)
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// e.g. "Mercredi 23 septembre"
export function dayLabelFr(date: Date): string {
  return capitalize(date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))
}

export function todayLabelFr(from: Date = new Date()): string {
  return dayLabelFr(from)
}

// "Aujourd'hui", "Demain", or "Mercredi 23 septembre" for anything further out.
export function relativeDayLabel(offset: number, from: Date = new Date()): string {
  if (offset === 0) return "Aujourd'hui"
  if (offset === 1) return 'Demain'
  const d = new Date(from)
  d.setDate(d.getDate() + offset)
  return dayLabelFr(d)
}

// "Aujourd'hui" / "Demain" / "Mercredi 23 septembre" for a real 'YYYY-MM-DD'
// date string (e.g. an agenda event's event_date), relative to today.
export function relativeDateLabel(dateStr: string, from: Date = new Date()): string {
  const target = new Date(dateStr + 'T00:00:00')
  return relativeDayLabel(daysUntil(target, from), from)
}

export function firstRoundCountdownLabel(from: Date = new Date()): string {
  const days = daysUntil(FIRST_ROUND_DATE, from)
  if (days > 0) return 'J-' + days + ' avant le 1er tour'
  if (days === 0) return "Aujourd'hui, 1er tour"
  const daysToSecond = daysUntil(SECOND_ROUND_DATE, from)
  if (daysToSecond > 0) return 'J-' + daysToSecond + ' avant le 2nd tour'
  if (daysToSecond === 0) return "Aujourd'hui, 2nd tour"
  return 'Présidentielle 2027 terminée'
}
