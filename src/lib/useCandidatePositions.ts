import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { CandidatePositionRow } from './dbTypes'

export interface CandidatePositionWithName extends CandidatePositionRow {
  candidate_name: string
}

// Public read-only reference data (candidate_positions, joined to
// candidates.full_name so Programmes.tsx can match rows to its CANDS
// roster by name, the same way Boussole.tsx matches affinite scores).
export function useCandidatePositions() {
  const [positions, setPositions] = useState<CandidatePositionWithName[] | null>(null)

  useEffect(() => {
    let active = true
    supabase
      .from('candidate_positions')
      .select('*, candidates(full_name)')
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          console.error('[supabase] candidate_positions:', error.message)
          setPositions([])
          return
        }
        const rows = (data as (CandidatePositionRow & { candidates: { full_name: string } | null })[] | null) ?? []
        setPositions(rows.map((r) => ({ ...r, candidate_name: r.candidates?.full_name ?? '' })))
      })
    return () => {
      active = false
    }
  }, [])

  return positions
}
