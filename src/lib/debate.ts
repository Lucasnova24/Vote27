import { useEffect, useState } from 'react'
import type { AgendaCandidateRef, AgendaRow } from './dbTypes'

// Tonight's debate comes from the real agenda (public.agenda), not from the
// app's own CANDS roster: its members are whoever is actually on the set
// (e.g. primary contenders), whether or not they're presidential candidates.

const PARIS_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
})

// "YYYY-MM-DD HH:MM:SS" in Paris time — agenda dates/times are Paris-local.
function parisStamp(now: Date): string {
  const p: Record<string, string> = {}
  PARIS_FMT.formatToParts(now).forEach((x) => { p[x.type] = x.value })
  const hour = p.hour === '24' ? '00' : p.hour
  return `${p.year}-${p.month}-${p.day} ${hour}:${p.minute}:${p.second}`
}

export function tonightDebate(events: AgendaRow[] | null, now: Date = new Date()): AgendaRow | null {
  if (!events) return null
  const today = parisStamp(now).slice(0, 10)
  return events.find((e) => e.category === 'debat' && e.event_date === today) ?? null
}

// Voting is open only on the debate's own day, from its start time on
// (same rule as public.debate_vote_allowed). With no known start time we
// can't tell, so it stays closed.
export function debateStarted(e: AgendaRow | null, now: Date = new Date()): boolean {
  if (!e || !e.event_date || !e.start_time) return false
  if (e.event_date !== parisStamp(now).slice(0, 10)) return false
  const start = e.event_date + ' ' + (e.start_time.length === 5 ? e.start_time + ':00' : e.start_time)
  return parisStamp(now) >= start
}

export function debateMembers(e: AgendaRow | null): AgendaCandidateRef[] {
  return e ? e.candidates.filter((c) => c.role === 'participant') : []
}

export function debateStartLabel(e: AgendaRow | null): string | null {
  return e?.start_time ? e.start_time.slice(0, 5).replace(':', 'h') : null
}

// Re-renders periodically so the vote opens by itself when the debate starts.
export function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
