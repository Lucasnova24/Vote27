import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, THEMES, THEME_STYLE } from '../data'
import { useCandidatePositions } from '../lib/useCandidatePositions'
import { PROGRAMMES_2022, KIND_LABEL } from '../programmes2022'
import StatusTag from './StatusTag'
import { ChevronRight } from './Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

// "Les programmes, côte à côte": theme chips + one card per candidate showing
// their position on the selected theme. Shared by the Programmes route and the
// Isoloir & Programmes tab. Tapping a candidate opens their full page.
export default function ProgrammesComparatif({ state: s, actions, isWeb }: Props) {
  const positions = useCandidatePositions()

  return (
    <div className="stk" style={{ gap: 14 }}>
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
          const prog = PROGRAMMES_2022[c.name]
          const th = prog?.themes[s.theme]
          const n = th?.mesures.length ?? 0
          return (
            <article key={c.name} className="card lift" style={{ padding: 16, borderTop: '4px solid ' + c.color }}>
              <button type="button" onClick={actions.openCandidate(c.name)} className="row" style={{ gap: 12, marginBottom: 12, width: '100%', textAlign: 'left' }} aria-label={'Voir les mesures de ' + c.name}>
                <span style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: '#5C617B' }}>{c.party}</div>
                </div>
                <StatusTag status={c.status} />
              </button>
              {pos ? (
                <div className="stk" style={{ gap: 8 }}>
                  <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#14162B' }}>{pos.resume}</div>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <span className="tag" style={{ background: '#EFEBE2', color: '#454A66' }}>{'Programme ' + pos.annee_programme}</span>
                    <a href={pos.source_url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5 }}>Source</a>
                  </div>
                </div>
              ) : th && th.resume ? (
                <div className="stk" style={{ gap: 10 }}>
                  <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#14162B' }}>{th.resume}</div>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <span className="tag" style={{ background: '#EFEBE2', color: '#454A66' }}>{prog.kind === 'propre' ? 'Programme 2022' : 'Programme 2022 · ' + KIND_LABEL[prog.kind]}</span>
                  </div>
                </div>
              ) : prog && prog.kind === 'aucun' ? (
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#5C617B', fontStyle: 'italic' }}>Pas de programme 2022 pour ce candidat ni son parti.</div>
              ) : prog ? (
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#5C617B', fontStyle: 'italic' }}>{'Rien de précis sur « ' + s.theme + ' » dans le programme 2022 retenu.'}</div>
              ) : (
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#5C617B', fontStyle: 'italic' }}>{'Position sur « ' + s.theme + ' » — programme pas encore renseigné dans l\'app.'}</div>
              )}
              <button type="button" onClick={actions.openCandidate(c.name)} className="row" style={{ marginTop: 12, gap: 4, fontSize: 13.5, fontWeight: 700, color: c.ink }}>
                {n > 0 ? 'Voir les ' + n + ' mesures sur ce thème' : 'Voir la fiche du candidat'}
                <ChevronRight size={15} />
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
