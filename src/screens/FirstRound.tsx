import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, FIRST_ROUND_HISTORY } from '../data'
import { backLink, flowWrap, h1Size } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function FirstRound({ state: s, actions, isWeb }: Props) {
  const done = s.firstRoundPick !== null

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 8 }}>
        <div className="eyebrow" style={{ color: '#6E3A00' }}>Sondage mensuel</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Ton vote au 1er tour</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>On te redemande chaque mois pour suivre l'évolution des intentions dans le temps. Rien n'est public ni partagé.</div>
      </div>

      {done && (
        <div className="stk" style={{ gap: 14 }}>
          <div className="pop" style={{ background: '#171B3C', color: '#fff', borderRadius: 22, padding: 22, textAlign: 'center' }}>
            <div className="eyebrow" style={{ color: '#A7ADD3' }}>Ta réponse de ce mois-ci</div>
            <div className="dsp" style={{ fontSize: 28, fontWeight: 800, marginTop: 10 }}>{CANDS[s.firstRoundPick as number].name}</div>
          </div>
          <button type="button" onClick={actions.changeFirstRound} className="btn" style={{ background: '#fff', color: '#14162B', border: '1.5px solid #DDD7C9' }}>Modifier ma réponse</button>
          <section aria-label="Historique">
            <h2 className="dsp" style={{ margin: '6px 0 12px', fontSize: 20, fontWeight: 700 }}>Historique</h2>
            <div className="card" style={{ padding: '6px 18px' }}>
              {FIRST_ROUND_HISTORY.map((h) => (
                <div key={h.month} className="row sep" style={{ gap: 12, minHeight: 56, padding: '10px 0' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', flex: 'none', background: h.color }} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600 }}>{h.name}</span>
                  <span style={{ fontSize: 13, color: '#5C617B' }}>{h.month}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {!done && (
        <div className="stk" style={{ gap: 10 }}>
          {CANDS.map((c, i) => (
            <button key={c.name} type="button" onClick={actions.pickFirstRound(i)} aria-pressed={s.firstRoundPick === i} className="row lift" style={{ width: '100%', gap: 14, minHeight: 64, padding: '12px 16px', border: '1.5px solid', borderRadius: 18, background: s.firstRoundPick === i ? c.soft : '#fff', borderColor: s.firstRoundPick === i ? c.color : '#E7E2D6' }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
              <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700 }}>{c.name}</span>
                <span style={{ display: 'block', fontSize: 13, color: '#5C617B' }}>{c.party}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
