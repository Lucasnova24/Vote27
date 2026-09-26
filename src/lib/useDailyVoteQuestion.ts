import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { VoteQuestionRow } from './dbTypes'
import { currentDayStart } from './day'

// Today's "Vote du jour" question — same for every user (deterministic pick
// by date, cf. get_daily_quiz), used by both VoteScreen (to ask it) and
// Isoloir (to show what was voted on, once answered).
export function useDailyVoteQuestion() {
  const [question, setQuestion] = useState<VoteQuestionRow | null>(null)

  useEffect(() => {
    let active = true
    supabase.rpc('get_daily_vote_question', { p_date: currentDayStart() }).then(({ data, error }) => {
      if (!active) return
      if (error) {
        console.error('[supabase] get_daily_vote_question:', error.message)
        return
      }
      const rows = (data as VoteQuestionRow[] | null) ?? []
      setQuestion(rows[0] ?? null)
    })
    return () => {
      active = false
    }
  }, [])

  return question
}
