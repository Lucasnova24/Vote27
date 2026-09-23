import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { useAgenda } from '../lib/useAgenda'
import { debateMembers, debateStarted, debateStartLabel, tonightDebate, useNow } from '../lib/debate'
import { dayLabelFr, relativeDateLabel } from '../lib/countdown'
import { backLink, flowWrap, h1Size } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

// Members of a debate aren't necessarily in CANDS, so they get a neutral
// palette cycled by position rather than a party color.
const MEMBER_COLORS = [
  { color: '#3B4FD8', soft: '#E3E7FF' },
  { color: '#0E7A6B', soft: '#D2F1EA' },
  { color: '#A85400', soft: '#FFEBC6' },
  { color: '#6B45D9', soft: '#E8E0FF' },
  { color: '#C2385A', soft: '#FFDCE5' },
  { color: '#0B6BB8', soft: '#D8EBFB' },
]

function initials(name: string): string {
  const parts = name.split(/[\s-]+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
}

export default function Debat({ state: s, actions, isWeb }: Props) {
  const events = useAgenda()
  const now = useNow()
  // The debate that was clicked; falls back to tonight's if none was given.
  const debate = (s.debateSlug && events?.find((e) => e.slug === s.debateSlug && e.category === 'debat')) || tonightDebate(events, now)
  const started = debateStarted(debate, now)
  const members = debateMembers(debate)
  const startLabel = debateStartLabel(debate)
  const pick = debate && s.debEvent === debate.slug ? s.debPick : null

  const steps = [
    { time: startLabel ?? '—', label: 'Début du débat — ouverture du vote, séquence par séquence', dot: '#8E9BFF' },
    { time: 'Fin', label: 'Vote final et comparaison des écarts', dot: '#5FD3BF' },
  ]

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>

      {events === null && <div style={{ fontSize: 13, color: '#5C617B' }}>Chargement…</div>}

      {events !== null && !debate && (
        <section className="card">
          <h1 className="dsp" style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700 }}>{s.debateSlug ? 'Débat introuvable' : 'Pas de débat ce soir'}</h1>
          <div style={{ fontSize: 14.5, color: '#454A66', lineHeight: 1.5 }}>Le vote s'ouvrira le soir du prochain débat, dès son début.</div>
        </section>
      )}

      {debate && (
        <>
          <div className="stk" style={{ gap: 10, alignItems: 'flex-start' }}>
            <span className="tag" style={{ background: '#FFDFD8', color: '#8A1F0E', textTransform: 'uppercase', letterSpacing: '.08em', padding: '6px 12px' }}>
              {started ? <><span className="live" aria-hidden="true" />Session live</> : debate.event_date ? relativeDateLabel(debate.event_date, now) : debate.display_date}
            </span>
            <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>{debate.title + (debate.media ? ' — ' + debate.media : '')}</h1>
            <div className="num" style={{ fontSize: 15, color: '#454A66' }}>
              {[debate.event_date ? dayLabelFr(new Date(debate.event_date + 'T00:00:00')) : debate.display_date, startLabel, members.length + ' participant' + (members.length > 1 ? 's' : '')].filter(Boolean).join(' · ')}
            </div>
          </div>

          <section className="card" aria-label="Vote du débat">
            <h2 className="dsp" style={{ margin: '0 0 14px', fontSize: 21, lineHeight: 1.15, fontWeight: 700 }}>Qui est le plus convaincant ?</h2>
            {!started && (
              <div style={{ fontSize: 14.5, color: '#454A66', lineHeight: 1.5, marginBottom: 12 }}>
                {debate.status === 'passe'
                  ? 'Ce débat est terminé, le vote est clos.'
                  : startLabel ? 'Le vote ouvre au début du débat, à ' + startLabel + '.' : 'Le vote ouvrira au début du débat (horaire non communiqué).'}
              </div>
            )}
            {members.length === 0 && <div style={{ fontSize: 14.5, color: '#454A66' }}>Participants non communiqués.</div>}
            <div className="stk" style={{ gap: 9 }}>
              {members.map((c, i) => {
                const pal = MEMBER_COLORS[i % MEMBER_COLORS.length]
                const active = pick === c.slug
                return (
                  <button
                    key={c.slug} type="button" disabled={!started} onClick={actions.setDebPick(debate.slug, c.slug)} aria-pressed={active}
                    className={started ? 'row lift' : 'row'}
                    style={{ width: '100%', gap: 12, minHeight: 60, padding: '10px 14px', border: '1.5px solid', borderRadius: 18, background: active ? pal.soft : '#fff', borderColor: active ? pal.color : '#E7E2D6', opacity: started ? 1 : 0.55, cursor: started ? 'pointer' : 'not-allowed' }}
                  >
                    <span style={{ width: 36, height: 36, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', background: pal.color }}>{initials(c.name)}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>
                      <span style={{ display: 'block', fontSize: 15.5, fontWeight: 600 }}>{c.name}</span>
                      <span style={{ display: 'block', fontSize: 13, color: '#5C617B' }}>{c.party}</span>
                    </span>
                    {active && <span className="tag" style={{ background: pal.color, color: '#fff' }}>Ton choix</span>}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="card" style={{ background: '#171B3C', borderColor: '#171B3C', color: '#fff' }} aria-label="Déroulé de la session">
            <h2 className="eyebrow" style={{ margin: '0 0 16px', color: '#A7ADD3' }}>Déroulé de la session</h2>
            <div className="stk">
              {steps.map((st, i) => (
                <div key={st.time} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', flex: 'none', border: '3px solid', background: '#171B3C', borderColor: st.dot }} />
                    <span style={{ flex: 1, width: 2, marginTop: 4, background: 'rgba(255,255,255,.18)', display: i < steps.length - 1 ? 'block' : 'none' }} />
                  </div>
                  <div style={{ paddingBottom: 18 }}>
                    <div className="dsp num" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>{st.time}</div>
                    <div style={{ fontSize: 14.5, color: '#B9BEDD', marginTop: 3, lineHeight: 1.4 }}>{st.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
