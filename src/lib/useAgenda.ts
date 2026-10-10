import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import type { AgendaRow } from './dbTypes'

// Today's date (YYYY-MM-DD) in Paris time — agenda dates are Paris-local.
function parisToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date())
}

// An event is past once its last day (end_date, else event_date) is before
// today. Undated events are kept (they have no day to expire on).
function isPast(e: AgendaRow, today: string): boolean {
  const last = e.end_date ?? e.event_date
  return !!last && last < today
}

// Shared by Accueil (next event today) and Agenda (full list) — one fetch
// pattern, kept local-component-state rather than in useAppState since it's
// public read-only reference data, not per-user state.
// Past events are dropped here, so no screen ever shows them; the cutoff is
// re-evaluated every minute so an app left open overnight cleans itself up.
export function useAgenda() {
  const [rows, setRows] = useState<AgendaRow[] | null>(null)
  const [today, setToday] = useState(parisToday)

  useEffect(() => {
    let active = true
    supabase
      .from('agenda')
      .select('*')
      .order('event_date', { ascending: true, nullsFirst: false })
      .order('start_time', { ascending: true, nullsFirst: false })
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          console.error('[supabase] agenda:', error.message)
          setRows([])
          return
        }
        setRows((data as AgendaRow[] | null) ?? [])
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setToday(parisToday()), 60_000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => (rows ? rows.filter((e) => !isPast(e, today)) : null), [rows, today])
}
