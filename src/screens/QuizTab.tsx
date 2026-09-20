import { useEffect, useState } from 'react'
import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { supabase } from '../lib/supabaseClient'
import type { LeaderboardRow } from '../lib/dbTypes'
import { ACCENT } from '../data'
import { card, h1, mono, screenWrap, sectionLabel, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function QuizTab({ state: s, actions }: Props) {
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

  return (
    <div style={screenWrap}>
      <div>
        <div style={sectionLabel}>Quiz</div>
        <h1 style={h1}>Cinq questions par jour</h1>
        <div style={{ fontSize: 13, color: '#6b7392', lineHeight: 1.45 }}>Une seule tentative : sinon le classement n'a pas de sens.</div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, padding: 14 }}>
          <div style={{ fontSize: 11, color: '#6b7392' }}>Aujourd'hui</div>
          <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 600, marginTop: 3 }}>{s.quizDoneToday ? s.quizScore + ' / 5' : 'à faire'}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, padding: 14 }}>
          <div style={{ fontSize: 11, color: '#6b7392' }}>Points</div>
          <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 600, marginTop: 3 }}>{s.points.toLocaleString('fr-FR')}</div>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-.015em' }}>
          Les institutions, en deux minutes
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: '#3c4460', marginTop: 8 }}>
          Chaque bonne réponse rapporte 20 ◆ et renvoie à sa source.
        </div>
        <div onClick={actions.openRoute('quiz')} style={{ marginTop: 14, textAlign: 'center', padding: 12, borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', background: ACCENT }}>
          {s.quizDoneToday ? 'Revoir mes réponses' : 'Commencer'}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 0 10px' }}>
          <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600 }}>Classement global</div>
          <div style={{ fontSize: 11, color: '#6b7392' }}>par points cumulés</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, overflow: 'hidden' }}>
          {leaderboard === null && (
            <div style={{ padding: '16px', fontSize: 12.5, color: '#6b7392' }}>Chargement…</div>
          )}
          {leaderboard !== null && leaderboard.length === 0 && (
            <div style={{ padding: '16px', fontSize: 12.5, color: '#6b7392' }}>Personne n'a encore marqué de points.</div>
          )}
          {leaderboard?.map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < leaderboard.length - 1 ? '1px solid #eef0f7' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: '#eef0f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#4d5680', flex: 'none' }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, letterSpacing: '-.01em' }}>{row.pseudo}</div>
              <div style={{ fontFamily: mono, fontSize: 11.5, color: '#6b7392' }}>{row.points.toLocaleString('fr-FR') + ' pts'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
