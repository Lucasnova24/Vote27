import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, POSITIONS, THEMES, THEME_STYLE } from '../data'
import { backLink, h1Size, wideWidth } from '../styles'
import { ChevronLeft, SourceIcon } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Programmes({ state: s, actions, isWeb }: Props) {
  const positions = CANDS.map((c, i) => ({
    name: c.name, party: c.party, color: c.color, ink: c.ink, initials: c.initials,
    text: POSITIONS[s.theme][i],
    source: 'Programme ' + c.party.slice(-1) + ', p. ' + (12 + i * 7),
  }))

  return (
    <div className="rise stk" style={{ gap: 18, width: '100%', margin: '0 auto', maxWidth: wideWidth(isWeb) }}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 8 }}>
        <div className="eyebrow">Programmes</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Côte à côte</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Six thèmes, cinq candidats, une source par position.</div>
      </div>
      <div role="group" aria-label="Choisir un thème" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: isWeb ? 0 : '0 -16px', padding: isWeb ? 0 : '0 16px' }}>
        {THEMES.map((t) => {
          const active = s.theme === t
          const ts = THEME_STYLE[t]
          return (
            <button key={t} type="button" onClick={actions.setTheme(t)} className="chip" aria-pressed={active} style={{ background: active ? ts.solid : '#fff', color: active ? '#fff' : '#454A66', borderColor: active ? ts.solid : '#DDD7C9' }}>
              {t}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: isWeb ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)' }}>
        {positions.map((p) => (
          <article key={p.name} className="card" style={{ padding: 16 }}>
            <div className="row" style={{ gap: 12, marginBottom: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', background: p.color }}>{p.initials}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: '#5C617B' }}>{p.party}</div>
              </div>
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.5, color: '#14162B' }}>{p.text}</div>
            <div className="row" style={{ gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #EDE9DF', fontSize: 13, fontWeight: 600, color: p.ink }}>
              <SourceIcon />{'Source · ' + p.source}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
