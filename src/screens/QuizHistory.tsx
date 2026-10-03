import { useEffect, useState } from 'react'
import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import type { DailyQuizRow } from '../lib/dbTypes'
import { supabase } from '../lib/supabaseClient'
import { backLink, flowWrap, h1Size } from '../styles'
import QuizReview from '../components/QuizReview'
import { ChevronLeft, ChevronRight } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

interface Day { date: string; answered: number; correct: number }

const dayLabel = (iso: string) => {
  const s = new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function QuizHistory({ actions, isWeb }: Props) {
  const [days, setDays] = useState<Day[] | null>(null)
  const [openDate, setOpenDate] = useState<string | null>(null)
  const [items, setItems] = useState<DailyQuizRow[] | null>(null)

  useEffect(() => {
    supabase
      .from('quiz_answers')
      .select('quiz_date,is_correct')
      .not('answered_at', 'is', null)
      .order('quiz_date', { ascending: false })
      .limit(1000)
      .then(({ data, error }) => {
        if (error) console.error('[supabase] quiz_answers history:', error.message)
        const byDay = new Map<string, Day>()
        ;((data ?? []) as { quiz_date: string; is_correct: boolean | null }[]).forEach((r) => {
          const d = byDay.get(r.quiz_date) ?? { date: r.quiz_date, answered: 0, correct: 0 }
          d.answered += 1
          if (r.is_correct) d.correct += 1
          byDay.set(r.quiz_date, d)
        })
        setDays([...byDay.values()].sort((a, b) => b.date.localeCompare(a.date)))
      })
  }, [])

  useEffect(() => {
    if (!openDate) return
    setItems(null)
    supabase.rpc('get_daily_quiz', { p_date: openDate }).then(({ data, error }) => {
      if (error) console.error('[supabase] get_daily_quiz(' + openDate + '):', error.message)
      setItems((data ?? []) as DailyQuizRow[])
    })
  }, [openDate])

  const day = openDate ? days?.find((d) => d.date === openDate) : null

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      {openDate ? (
        <button type="button" onClick={() => setOpenDate(null)} style={backLink}><ChevronLeft />Historique</button>
      ) : (
        <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      )}

      <div className="stk" style={{ gap: 8 }}>
        <div className="eyebrow">{openDate ? 'Quiz du jour' : 'Quiz'}</div>
        <h1 className="dsp" style={{ margin: 0, fontWeight: 700, lineHeight: 1.05, fontSize: h1Size(isWeb) }}>
          {openDate ? dayLabel(openDate) : 'Historique de vos réponses'}
        </h1>
        {day && <div className="num" style={{ fontSize: 15, color: '#454A66' }}>{'Score : ' + day.correct + ' / ' + day.answered}</div>}
      </div>

      {!openDate && (
        <>
          {days === null && <div style={{ fontSize: 13, color: '#5C617B' }}>Chargement…</div>}
          {days !== null && days.length === 0 && (
            <div className="card" style={{ fontSize: 14.5, color: '#454A66', lineHeight: 1.5 }}>Aucun quiz terminé pour l'instant. Vos réponses apparaîtront ici dès le premier quiz.</div>
          )}
          {days !== null && days.length > 0 && (
            <div className="card" style={{ padding: '6px 18px' }}>
              {days.map((d) => (
                <button key={d.date} type="button" onClick={() => setOpenDate(d.date)} className="row sep" style={{ width: '100%', minHeight: 62, gap: 12 }}>
                  <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, fontWeight: 600 }}>{dayLabel(d.date)}</span>
                  <span className="tag num" style={{ background: d.correct === d.answered ? '#DDF3E3' : '#EFEBE2', color: d.correct === d.answered ? '#14532D' : '#454A66' }}>{d.correct + ' / ' + d.answered}</span>
                  <ChevronRight size={18} color="#5C617B" />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {openDate && (
        <>
          {items === null && <div style={{ fontSize: 13, color: '#5C617B' }}>Chargement…</div>}
          {items !== null && items.length === 0 && <div className="card" style={{ fontSize: 14.5, color: '#454A66' }}>Aucune question pour cette date.</div>}
          {items !== null && items.length > 0 && <QuizReview items={items} />}
        </>
      )}
    </div>
  )
}
