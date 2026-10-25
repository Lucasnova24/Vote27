import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { VoteQuestionRow } from './dbTypes'
import { currentDayStart } from './day'

// Today's "Vote du jour" question (with its pour / contre arguments) — same for every user (deterministic pick
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
      const row = ((data as VoteQuestionRow[] | null) ?? [])[0] ?? null
      setQuestion(row)
      if (!row) return
      // get_daily_vote_question ne renvoie pas les arguments : on les lit sur la question du jour.
      supabase.from('vote_questions').select('arguments_pour, arguments_contre').eq('code', row.code).maybeSingle().then(({ data: args, error: argsError }) => {
        if (!active) return
        if (argsError) {
          console.error('[supabase] vote_questions arguments:', argsError.message)
          return
        }
        if (args) setQuestion({ ...row, arguments_pour: args.arguments_pour ?? [], arguments_contre: args.arguments_contre ?? [] })
      })
    })
    return () => {
      active = false
    }
  }, [])

  return question
}
