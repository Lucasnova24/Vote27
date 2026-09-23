import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, DEBATE_STEPS } from '../data'
import { todayLabelFr } from '../lib/countdown'
import { backLink, flowWrap, h1Size } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

const DECLARED = CANDS.filter((c) => c.status === 'déclaré')

export default function Debat({ state: s, actions, isWeb }: Props) {
  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 10, alignItems: 'flex-start' }}>
        <span className="tag" style={{ background: '#FFDFD8', color: '#8A1F0E', textTransform: 'uppercase', letterSpacing: '.08em', padding: '6px 12px' }}>
          <span className="live" aria-hidden="true" />Session live
        </span>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Débat télévisé — France 2</h1>
        <div className="num" style={{ fontSize: 15, color: '#454A66' }}>{todayLabelFr() + ' · 21:00 · Candidats déclarés'}</div>
      </div>

      <section className="card" aria-label="Pronostic avant débat">
        <h2 className="dsp" style={{ margin: '0 0 14px', fontSize: 21, lineHeight: 1.15, fontWeight: 700 }}>Avant le débat — qui sera le plus convaincant ?</h2>
        <div className="stk" style={{ gap: 9 }}>
          {DECLARED.map((c) => {
            const i = CANDS.indexOf(c)
            const active = s.debPick === i
            return (
              <button key={c.name} type="button" onClick={actions.setDebPick(i)} aria-pressed={active} className="row lift" style={{ width: '100%', gap: 12, minHeight: 60, padding: '10px 14px', border: '1.5px solid', borderRadius: 18, background: active ? c.soft : '#fff', borderColor: active ? c.color : '#E7E2D6' }}>
                <span style={{ width: 36, height: 36, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
                <span style={{ flex: 1, fontSize: 15.5, fontWeight: 600, textAlign: 'left' }}>{c.name}</span>
                {active && <span className="tag" style={{ background: c.color, color: '#fff' }}>Ton choix</span>}
              </button>
            )
          })}
        </div>
      </section>

      <section className="card" style={{ background: '#171B3C', borderColor: '#171B3C', color: '#fff' }} aria-label="Déroulé de la session">
        <h2 className="eyebrow" style={{ margin: '0 0 16px', color: '#A7ADD3' }}>Déroulé de la session</h2>
        <div className="stk">
          {DEBATE_STEPS.map((st, i) => (
            <div key={st.time} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', flex: 'none', border: '3px solid', background: '#171B3C', borderColor: st.dot }} />
                <span style={{ flex: 1, width: 2, marginTop: 4, background: 'rgba(255,255,255,.18)', display: i < DEBATE_STEPS.length - 1 ? 'block' : 'none' }} />
              </div>
              <div style={{ paddingBottom: 18 }}>
                <div className="dsp num" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>{st.time}</div>
                <div style={{ fontSize: 14.5, color: '#B9BEDD', marginTop: 3, lineHeight: 1.4 }}>{st.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
