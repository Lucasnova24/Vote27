import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { DailyQuizRow } from './dbTypes'
import { currentDayStart } from './day'

export interface DailyQuizQuestion {
  code: string
  themeLabel: string
  question: string
  explication: string | null
  choices: string[]
  correctIndex: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Today's 5 questions, same for every user (public.get_daily_quiz picks them
// deterministically by date), with the 4 answers shuffled once per question
// so the correct one isn't always first.
export function useDailyQuiz() {
  const [quiz, setQuiz] = useState<DailyQuizQuestion[] | null>(null)

  useEffect(() => {
    let active = true
    supabase.rpc('get_daily_quiz', { p_date: currentDayStart() }).then(({ data, error }) => {
      if (!active) return
      if (error) {
        console.error('[supabase] get_daily_quiz:', error.message)
        setQuiz([])
        return
      }
      const rows = (data as DailyQuizRow[] | null) ?? []
      setQuiz(rows.map((r) => {
        const options = shuffle([
          { text: r.bonne_reponse, correct: true },
          { text: r.mauvaise_1, correct: false },
          { text: r.mauvaise_2, correct: false },
          { text: r.mauvaise_3, correct: false },
        ])
        return {
          code: r.code,
          themeLabel: r.theme_label,
          question: r.question,
          explication: r.explication,
          choices: options.map((o) => o.text),
          correctIndex: options.findIndex((o) => o.correct),
        }
      }))
    })
    return () => {
      active = false
    }
  }, [])

  return quiz
}
