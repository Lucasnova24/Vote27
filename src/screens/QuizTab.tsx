import { useEffect, useState } from 'react'
import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { supabase } from '../lib/supabaseClient'
import type { LeaderboardRow } from '../lib/dbTypes'
import { gapPage, h1Size } from '../styles'
import Grid2 from '../components/Grid2'
import { ChevronRight, QuizIcon } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function QuizTab({ state: s, actions, isWeb }: Props) {
  const gap = gapPage(isWeb)
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[] | null>(null)

  useEffect(() => {
    let active = true
    supabase.rpc('get_leaderboard', { limit_n: 10 }).then(({ data, error }) => {
      if (!active) return
      if (error) {
        console.error('[supabase] get_leaderboard:', error.message)
        return
      }
      setLeaderboard((data as LeaderboardRow[] | null) ?? [])
    })
    return () => {
      active = false
    }
  }, [s.points])

  const rate = s.quizAttemptsTotal > 0 ? Math.round((s.quizCorrectTotal / s.quizAttemptsTotal) * 100) : 0

  const colA = (
    <>
      <div style={{ order: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: s.quizDoneToday ? '#DDF3E3' : '#FFF4DA', border: '1px solid ' + (s.quizDoneToday ? '#8CC9A0' : '#F2DFAE'), borderRadius: 22, padding: '16px 18px' }}>
          <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
            <span className="row" style={{ gap: 8, color: s.quizDoneToday ? '#14532D' : '#6E3A00' }}>
              <QuizIcon size={18} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Aujourd'hui</span>
            </span>
            {s.quizDoneToday && (
              <span className="tag" style={{ background: 'rgba(255,255,255,.55)', color: '#14532D' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>Fait
              </span>
            )}
          </div>
          <div className="dsp num" style={{ fontSize: 30, fontWeight: 800, marginTop: 8, color: s.quizDoneToday ? '#14532D' : '#6E3A00' }}>
            {s.quizDoneToday ? s.quizScore + ' / 5' : 'à faire'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: '#EFEBE2', borderRadius: 22, padding: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#454A66' }}>Taux de bonne réponse</span>
            <div className="dsp num" style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: '#14162B' }}>{rate + ' %'}</div>
          </div>
          <div style={{ flex: 1, background: '#EFEBE2', borderRadius: 22, padding: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#454A66' }}>Bonnes réponses</span>
            <div className="dsp num" style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: '#14162B' }}>{String(s.quizCorrectTotal)}</div>
          </div>
        </div>
      </div>

      <section className="card" style={{ order: 2 }} aria-label="Quiz du jour">
        <h2 className="dsp" style={{ margin: 0, fontSize: 25, lineHeight: 1.08, fontWeight: 700 }}>Les institutions, en deux minutes</h2>
        <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#454A66', marginTop: 8 }}>{'Chaque bonne réponse rapporte 20 ◆ et renvoie à sa source.'}</div>
        <button type="button" onClick={actions.openRoute('quiz')} className="btn" style={{ marginTop: 16, background: '#A85400' }}>
          {s.quizDoneToday ? 'Revoir mes réponses' : 'Commencer'}
        </button>
      </section>
    </>
  )

  const colB = (
    <section style={{ order: 3 }} aria-label="Classement">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', margin: '6px 0 12px' }}>
        <h2 className="dsp" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Classement</h2>
        <span style={{ fontSize: 13, color: '#5C617B' }}>par points cumulés</span>
      </div>
      <div className="card" style={{ padding: 6 }}>
        {leaderboard === null && (
          <div style={{ padding: 16, fontSize: 13, color: '#5C617B' }}>Chargement…</div>
        )}
        {leaderboard !== null && leaderboard.length === 0 && (
          <div style={{ padding: 16, fontSize: 13, color: '#5C617B' }}>Personne n'a encore marqué de points.</div>
        )}
        {leaderboard?.map((row, i) => (
          <div key={i} className="row sep rowh" style={{ gap: 12, minHeight: 66, padding: '10px 12px', borderRadius: 18 }}>
            <span style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, background: '#E3E7FF', color: '#1F2A8A' }}>{i + 1}</span>
            <span style={{ flex: 1, minWidth: 0, display: 'block' }}>
              <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, letterSpacing: '-.01em' }}>{row.pseudo}</span>
              <span style={{ display: 'block', fontSize: 13, color: '#5C617B', marginTop: 1 }}>{row.points.toLocaleString('fr-FR') + ' points'}</span>
            </span>
            <ChevronRight size={18} color="#5C617B" />
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div className="rise stk" style={{ gap }}>
      <div className="stk" style={{ gap: 8, marginBottom: 4 }}>
        <div className="eyebrow">Quiz</div>
        <h1 className="dsp" style={{ margin: 0, fontWeight: 700, lineHeight: 1, fontSize: h1Size(isWeb) }}>Cinq questions par jour</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Une seule tentative : sinon le classement n'a pas de sens.</div>
      </div>
      <Grid2 isWeb={isWeb} gap={gap} colA={colA} colB={colB} />
    </div>
  )
}
