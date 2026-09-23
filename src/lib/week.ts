// The weekly poll (Mon vote du 1er tour) resets every Sunday: this returns
// the most recent Sunday (or today, if today is a Sunday) as 'YYYY-MM-DD',
// used as the period key for a given week's pick.
export function currentWeekStart(date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00')
  return 'Semaine du ' + d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
