import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, THEMES, THEME_STYLE } from '../data'
import { useCandidatePositions } from '../lib/useCandidatePositions'
import { backLink, h1Size, wideWidth } from '../styles'
import StatusTag from '../components/StatusTag'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Programmes({ state: s, actions, isWeb }: Props) {
  const positions = useCandidatePositions()

  return (
    <div className="rise stk" style={{ gap: 18, width: '100%', margin: '0 auto', maxWidth: wideWidth(isWeb) }}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 8 }}>
        <div className="eyebrow">Programmes</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Côte à côte</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Six thèmes, tous les candidats. Les positions sourcées seront ajoutées au fur et à mesure de la publication des programmes officiels.</div>
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
        {CANDS.map((c) => {
          const pos = positions?.find((p) => p.candidate_name === c.name && p.theme === s.theme) ?? null
          return (
            <article key={c.name} className="card" style={{ padding: 16 }}>
              <div className="row" style={{ gap: 12, marginBottom: 12 }}>
                <span style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: '#5C617B' }}>{c.party}</div>
                </div>
                <StatusTag status={c.status} />
              </div>
              {pos ? (
                <div className="stk" style={{ gap: 8 }}>
                  <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#14162B' }}>{pos.resume}</div>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <span className="tag" style={{ background: '#EFEBE2', color: '#454A66' }}>{'Programme ' + pos.annee_programme}</span>
                    <a href={pos.source_url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5 }}>Source</a>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#5C617B', fontStyle: 'italic' }}>
                  {'Position sur « ' + s.theme + ' » — programme pas encore renseigné dans l\'app.'}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
