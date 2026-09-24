import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, THEMES, THEME_STYLE } from '../data'
import StatusTag from './StatusTag'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function ProgrammesGrid({ state: s, actions, isWeb }: Props) {
  return (
    <>
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
        {CANDS.map((c) => (
          <article key={c.name} className="card" style={{ padding: 16 }}>
            <div className="row" style={{ gap: 12, marginBottom: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: '#5C617B' }}>{c.party}</div>
              </div>
              <StatusTag status={c.status} />
            </div>
            <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#5C617B', fontStyle: 'italic' }}>
              {'Position sur « ' + s.theme + ' » — programme pas encore renseigné dans l\'app.'}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
