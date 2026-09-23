import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { AgendaRow } from './dbTypes'

// Shared by Accueil (next event today) and Agenda (full list) — one fetch
// pattern, kept local-component-state rather than in useAppState since it's
// public read-only reference data, not per-user state.
export function useAgenda() {
  const [events, setEvents] = useState<AgendaRow[] | null>(null)

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
          setEvents([])
          return
        }
        setEvents((data as AgendaRow[] | null) ?? [])
      })
    return () => {
      active = false
    }
  }, [])

  return events
}
