import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, POSITIONS, THEMES } from '../data'
import { backLink, mono, screenWrap, sectionLabel, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function Programmes({ state: s, actions }: Props) {
  const positions = CANDS.map((c, i) => ({
    name: c.name,
    party: c.party,
    color: c.color,
    text: POSITIONS[s.theme][i],
    source: 'Programme ' + c.party.slice(-1) + ', p. ' + (12 + i * 7),
  }))

  return (
    <div className="rise-in" style={screenWrap}>
      <div onClick={actions.back} style={backLink}>‹ Retour</div>
      <div>
        <div style={sectionLabel}>Programmes</div>
        <h1 style={{ margin: '6px 0 4px', fontFamily: serif, fontSize: 29, lineHeight: 1.12, fontWeight: 600, letterSpacing: '-.02em' }}>Côte à côte</h1>
        <div style={{ fontSize: 13, color: '#6b7392', lineHeight: 1.45 }}>Six thèmes, cinq candidats, une source par position.</div>
      </div>

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {THEMES.map((t) => {
          const active = s.theme === t
          return (
            <div key={t} onClick={actions.setTheme(t)} style={{ padding: '7px 13px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid', background: active ? '#1b2a63' : '#fff', color: active ? '#fff' : '#4d5680', borderColor: active ? '#1b2a63' : '#dde1ee' }}>
              {t}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {positions.map((p) => (
          <div key={p.name} style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 14, padding: 14, borderLeft: '3px solid ' + p.color }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 10.5, color: '#6b7392' }}>{p.party}</div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: '#3c4460', marginTop: 6 }}>{p.text}</div>
            <div style={{ fontSize: 10.5, color: '#8189a8', marginTop: 8, fontFamily: mono }}>Source · {p.source}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
