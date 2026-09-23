import { useEffect, useState } from 'react'
import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS } from '../data'
import { supabase } from '../lib/supabaseClient'
import { currentWeekStart, formatWeekLabel, nextWeekLabel } from '../lib/week'
import { backLink, flowWrap, h1Size } from '../styles'
import StatusTag from '../components/StatusTag'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

interface HistoryRow {
  week_start: string
  candidate_index: number
}

export default function FirstRound({ state: s, actions, isWeb }: Props) {
  const done = s.firstRoundPick !== null
  const [history, setHistory] = useState<HistoryRow[] | null>(null)
  const thisWeek = currentWeekStart()

  useEffect(() => {
    supabase
      .from('first_round_picks')
      .select('week_start,candidate_index')
      .neq('week_start', thisWeek)
      .order('week_start', { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (error) {
          console.error('[supabase] first_round_picks history:', error.message)
          return
        }
        setHistory((data as HistoryRow[] | null) ?? [])
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  const declared = CANDS.filter((c) => c.status === 'déclaré')
  const pressenti = CANDS.filter((c) => c.status === 'pressenti')

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 8 }}>
        <div className="eyebrow" style={{ color: '#6E3A00' }}>Sondage hebdomadaire</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Ton vote au 1er tour</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Un vote par semaine, définitif jusqu'au dimanche suivant : on te redemande chaque dimanche pour suivre l'évolution de tes intentions. Rien n'est public ni partagé.</div>
      </div>

      {done && (
        <div className="stk" style={{ gap: 14 }}>
          <div className="pop" style={{ background: '#171B3C', color: '#fff', borderRadius: 22, padding: 22, textAlign: 'center' }}>
            <div className="eyebrow" style={{ color: '#A7ADD3' }}>Ta réponse cette semaine</div>
            <div className="dsp" style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{CANDS[s.firstRoundPick as number].name}</div>
          </div>
          <div style={{ background: '#FFF4DA', borderRadius: 18, padding: '14px 16px', fontSize: 14.5, lineHeight: 1.5, color: '#6E3A00' }}>
            {'Ta réponse est enregistrée pour la semaine et ne peut plus être modifiée. Prochain vote : ' + nextWeekLabel() + '.'}
          </div>
          {history && history.length > 0 && (
            <section aria-label="Historique">
              <h2 className="dsp" style={{ margin: '6px 0 12px', fontSize: 20, fontWeight: 700 }}>Historique</h2>
              <div className="card" style={{ padding: '6px 18px' }}>
                {history.map((h) => {
                  const c = CANDS[h.candidate_index]
                  if (!c) return null
                  return (
                    <div key={h.week_start} className="row sep" style={{ gap: 12, minHeight: 56, padding: '10px 0' }}>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', flex: 'none', background: c.color }} />
                      <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontSize: 13, color: '#5C617B' }}>{formatWeekLabel(h.week_start)}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {!done && (
        <div className="stk" style={{ gap: 20 }}>
          <div>
            <h2 className="eyebrow" style={{ margin: '0 0 10px' }}>Candidats déclarés</h2>
            <div className="stk" style={{ gap: 10 }}>
              {declared.map((c) => {
                const i = CANDS.indexOf(c)
                return (
                  <button key={c.name} type="button" onClick={actions.pickFirstRound(i)} className="row lift" style={{ width: '100%', gap: 14, minHeight: 64, padding: '12px 16px', border: '1.5px solid #E7E2D6', borderRadius: 18, background: '#fff' }}>
                    <span style={{ width: 36, height: 36, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
                    <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700 }}>{c.name}</span>
                      <span style={{ display: 'block', fontSize: 13, color: '#5C617B' }}>{c.party}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <h2 className="eyebrow" style={{ margin: '0 0 10px' }}>Personnalités pressenties</h2>
            <div className="stk" style={{ gap: 10 }}>
              {pressenti.map((c) => {
                const i = CANDS.indexOf(c)
                return (
                  <button key={c.name} type="button" onClick={actions.pickFirstRound(i)} className="row lift" style={{ width: '100%', gap: 14, minHeight: 64, padding: '12px 16px', border: '1.5px solid #E7E2D6', borderRadius: 18, background: '#fff' }}>
                    <span style={{ width: 36, height: 36, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
                    <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700 }}>{c.name}</span>
                      <span style={{ display: 'block', fontSize: 13, color: '#5C617B' }}>{c.party}</span>
                    </span>
                    <StatusTag status="pressenti" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
