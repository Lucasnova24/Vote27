// The weekly poll (Mon vote du 1er tour) resets every Sunday: this returns
// the most recent Sunday (or today, if today is a Sunday) as 'YYYY-MM-DD',
// used as the period key for a given week's pick. Computed on the Paris
// calendar, like the server-side rule on first_round_picks.
import { parisDate, isoDay } from './day'

export function currentWeekStart(date = new Date()): string {
  const d = parisDate(date)
  d.setDate(d.getDate() - d.getDay())
  return isoDay(d)
}

// The Sunday the next pick opens, e.g. "dimanche 27 septembre".
export function nextWeekLabel(date = new Date()): string {
  const d = new Date(currentWeekStart(date) + 'T00:00:00')
  d.setDate(d.getDate() + 7)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00')
  return 'Semaine du ' + d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
