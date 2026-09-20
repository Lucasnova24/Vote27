import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, CANDS, DEBATE_PCTS, DEBATE_STEPS } from '../data'
import { backLink, card, mono, screenWrap, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function Debat({ state: s, actions }: Props) {
  return (
    <div className="rise-in" style={screenWrap}>
      <div onClick={actions.back} style={backLink}>‹ Retour</div>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600, color: '#c02742' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c02742', animation: 'pulseLive 1.6s infinite' }} />Session live
        </div>
        <h1 style={{ margin: '8px 0 4px', fontFamily: serif, fontSize: 29, lineHeight: 1.12, fontWeight: 600, letterSpacing: '-.02em' }}>
          Débat télévisé — France 2
        </h1>
        <div style={{ fontSize: 13, color: '#6b7392' }}>Jeudi 15 avril · 21:00 · Les 5 candidats</div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>Avant le débat — qui sera le plus convaincant ?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CANDS.map((c, i) => {
            const active = s.debPick === i
            return (
              <div key={c.name} onClick={actions.setDebPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', border: '1.5px solid', borderRadius: 12, cursor: 'pointer', background: active ? '#eef2fb' : '#fff', borderColor: active ? ACCENT : '#e3e7f3' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 600, color: '#fff', background: c.color }}>{c.initials}</div>
                <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontFamily: mono, fontSize: 12, color: '#6b7392' }}>{DEBATE_PCTS[i] + '%'}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background: '#1b2a63', color: '#fff', borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a8b3d8', marginBottom: 10 }}>Déroulé de la session</div>
        {DEBATE_STEPS.map((st) => (
          <div key={st.time} style={{ display: 'flex', gap: 12, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,.12)' }}>
            <div style={{ fontFamily: mono, fontSize: 12, color: '#c3cbe8', width: 44, flex: 'none' }}>{st.time}</div>
            <div style={{ flex: 1, fontSize: 13 }}>{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
