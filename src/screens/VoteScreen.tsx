import { useEffect, useState } from 'react'
import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT } from '../data'
import { supabase } from '../lib/supabaseClient'
import { useDailyVoteQuestion } from '../lib/useDailyVoteQuestion'
import { backLink, flowWrap, h1Size } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function VoteScreen({ state: s, actions, isWeb }: Props) {
  const voteDone = s.voteChoice !== null
  const question = useDailyVoteQuestion()
  const [tally, setTally] = useState<{ oui: number; non: number } | null>(null)

  // Real tally of every ballot cast in the app (get_vote_results RPC).
  useEffect(() => {
    if (!voteDone) return
    supabase.rpc('get_vote_results').then(({ data, error }) => {
      if (error) {
        console.error('[supabase] get_vote_results:', error.message)
        return
      }
      const rows = (data as { choice: string; total: number }[] | null) ?? []
      const get = (c: string) => Number(rows.find((r) => r.choice === c)?.total ?? 0)
      setTally({ oui: get('oui'), non: get('non') })
    })
  }, [voteDone, s.voteSaved])

  const total = tally ? tally.oui + tally.non : 0
  const results = tally && total > 0
    ? [
        { label: 'Oui', pct: Math.round((tally.oui / total) * 100) + '%', color: ACCENT },
        { label: 'Non', pct: Math.round((tally.non / total) * 100) + '%', color: '#C26A00' },
      ]
    : []

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 10 }}>
        <div className="eyebrow">Vote du jour</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.04, fontWeight: 700 }}>{question?.question ?? 'Chargement…'}</h1>
      </div>
      <div style={{ background: '#E3E7FF', borderRadius: 18, padding: '14px 16px', fontSize: 14.5, lineHeight: 1.55, color: '#1F2A8A' }}>
        Question posée à tous les inscrits. Un seul bulletin par personne. Le résultat affiché est le décompte réel des bulletins déposés dans l'app.
      </div>

      {!voteDone && question && (
        <div className="stk" style={{ gap: 12 }}>
          <button type="button" onClick={actions.vote('oui', question.code)} className="press" style={{ display: 'block', width: '100%', padding: '22px 20px', borderRadius: 22, background: '#E3E7FF', border: '1.5px solid #B8C0F5', textAlign: 'left' }}>
            <span className="dsp" style={{ display: 'block', fontSize: 32, fontWeight: 800, color: '#1F2A8A', lineHeight: 1 }}>Oui</span>
            <span style={{ display: 'block', fontSize: 14.5, color: '#2A3596', marginTop: 6 }}>{question.oui_label}</span>
          </button>
          <button type="button" onClick={actions.vote('non', question.code)} className="press" style={{ display: 'block', width: '100%', padding: '22px 20px', borderRadius: 22, background: '#FFEBC6', border: '1.5px solid #F2CD86', textAlign: 'left' }}>
            <span className="dsp" style={{ display: 'block', fontSize: 32, fontWeight: 800, color: '#6E3A00', lineHeight: 1 }}>Non</span>
            <span style={{ display: 'block', fontSize: 14.5, color: '#7A4300', marginTop: 6 }}>{question.non_label}</span>
          </button>
        </div>
      )}

      {voteDone && (
        <div className="stk" style={{ gap: 14 }}>
          <div className="card rise stk" style={{ gap: 16 }}>
            {tally === null && <div style={{ fontSize: 14, color: '#5C617B' }}>Chargement des résultats…</div>}
            {results.map((r) => (
              <div key={r.label}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="row" style={{ gap: 8, fontSize: 16, fontWeight: 700 }}>
                    {r.label}
                    {s.voteChoice === r.label.toLowerCase() && <span className="tag" style={{ background: '#171B3C', color: '#fff' }}>Ton choix</span>}
                  </span>
                  <span className="dsp num" style={{ fontSize: 26, fontWeight: 700 }}>{r.pct}</span>
                </div>
                <div className="bar" style={{ height: 14 }}><i style={{ width: r.pct, background: r.color }} /></div>
              </div>
            ))}
            {tally !== null && (
              <div className="num" style={{ fontSize: 13, color: '#5C617B', paddingTop: 12, borderTop: '1px solid #EDE9DF' }}>{total + (total > 1 ? ' bulletins' : ' bulletin')}</div>
            )}
          </div>
          <div className="pop" style={{ background: '#171B3C', color: '#fff', borderRadius: 22, padding: 22, textAlign: 'center' }}>
            <div className="dsp num" style={{ fontSize: 44, fontWeight: 800, color: '#F0A03C', lineHeight: 1 }}>+15 ◆</div>
            <div style={{ fontSize: 14.5, color: '#B9BEDD', marginTop: 8 }}>{'Bulletin enregistré : ' + (s.voteChoice === 'oui' ? 'Oui' : 'Non')}</div>
          </div>
          <button type="button" onClick={actions.back} className="btn" style={{ background: ACCENT }}>Retour au bulletin</button>
        </div>
      )}
    </div>
  )
}
