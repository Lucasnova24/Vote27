import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { AffiniteQuestionRow, AffiniteScoreRow, AffiniteThemeRow } from './dbTypes'

export interface AffiniteBank {
  themes: AffiniteThemeRow[]
  questions: AffiniteQuestionRow[]
}

// Public read-only reference data (10 themes, 100 statements) — same fetch
// pattern as useAgenda: fetched once per mount, not tied to a specific user.
export function useAffiniteBank() {
  const [bank, setBank] = useState<AffiniteBank | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([
      supabase.from('affinite_themes').select('*').order('ordre'),
      supabase.from('affinite_questions').select('*').order('ordre'),
    ]).then(([themesRes, questionsRes]) => {
      if (!active) return
      if (themesRes.error) console.error('[supabase] affinite_themes:', themesRes.error.message)
      if (questionsRes.error) console.error('[supabase] affinite_questions:', questionsRes.error.message)
      setBank({
        themes: (themesRes.data as AffiniteThemeRow[] | null) ?? [],
        questions: (questionsRes.data as AffiniteQuestionRow[] | null) ?? [],
      })
    })
    return () => {
      active = false
    }
  }, [])

  return bank
}

// Candidate compatibility ranking for the signed-in user — recomputed from
// their affinite_responses each time the result screen is shown, so it
// always reflects the latest sourced candidate positions.
export function useAffiniteScores(enabled: boolean) {
  const [scores, setScores] = useState<AffiniteScoreRow[] | null>(null)

  useEffect(() => {
    if (!enabled) {
      setScores(null)
      return
    }
    let active = true
    supabase.rpc('get_affinite_scores').then(({ data, error }) => {
      if (!active) return
      if (error) {
        console.error('[supabase] get_affinite_scores:', error.message)
        setScores([])
        return
      }
      setScores((data as AffiniteScoreRow[] | null) ?? [])
    })
    return () => {
      active = false
    }
  }, [enabled])

  return scores
}
