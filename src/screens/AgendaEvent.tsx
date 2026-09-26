import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, EVENT_CATEGORY_STYLE, RELIABILITY_STYLE } from '../data'
import { useAgenda } from '../lib/useAgenda'
import { dayLabelFr } from '../lib/countdown'
import { backLink, flowWrap, h1Size } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

const ROLE_LABEL: Record<string, string> = {
  participant: 'Participant',
  invite: 'Invité',
  organisateur: 'Organisateur',
}

function candidateStyle(name: string) {
  const c = CANDS.find((x) => x.name === name)
  if (c) return { color: c.color, soft: c.soft, ink: c.ink, initials: c.initials }
  const initials = name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return { color: '#5C617B', soft: '#EFEBE2', ink: '#454A66', initials: initials || '?' }
}

export default function AgendaEvent({ state: s, actions, isWeb }: Props) {
  const events = useAgenda()
  const e = s.agendaSlug ? events?.find((x) => x.slug === s.agendaSlug) ?? null : null
  const cat = e ? EVENT_CATEGORY_STYLE[e.category] : null
  const rel = e ? RELIABILITY_STYLE[e.reliability] : null

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>

      {events === null && <div style={{ fontSize: 13, color: '#5C617B' }}>Chargement…</div>}

      {events !== null && !e && (
        <section className="card">
          <h1 className="dsp" style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700 }}>Événement introuvable</h1>
          <div style={{ fontSize: 14.5, color: '#454A66', lineHeight: 1.5 }}>Cet événement n'existe plus ou a été retiré de l'agenda.</div>
        </section>
      )}

      {e && cat && (
        <>
          <div className="stk" style={{ gap: 10, alignItems: 'flex-start' }}>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <span className="tag" style={{ background: cat.soft, color: cat.ink }}>{cat.label}</span>
              {rel && <span className="tag" style={{ background: rel.soft, color: rel.ink }}>{rel.label}</span>}
            </div>
            <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.05, fontWeight: 700 }}>{e.title}</h1>
            <div className="num" style={{ fontSize: 15, color: '#454A66' }}>
              {[
                e.event_date ? dayLabelFr(new Date(e.event_date + 'T00:00:00')) : e.display_date,
                e.end_date && e.end_date !== e.event_date ? '→ ' + dayLabelFr(new Date(e.end_date + 'T00:00:00')) : null,
                e.start_time ? e.start_time.slice(0, 5) : null,
              ].filter(Boolean).join(' · ')}
            </div>
          </div>

          {e.description && (
            <section className="card">
              <div style={{ fontSize: 15, lineHeight: 1.6, color: '#14162B' }}>{e.description}</div>
            </section>
          )}

          <section className="card stk" style={{ gap: 10 }}>
            <h2 className="dsp" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Lieu et diffusion</h2>
            <div className="stk" style={{ gap: 6 }}>
              {e.location && <div style={{ fontSize: 14.5, color: '#454A66' }}>{'Lieu · ' + e.location}</div>}
              {e.city && <div style={{ fontSize: 14.5, color: '#454A66' }}>{'Ville · ' + e.city}</div>}
              {e.media && <div style={{ fontSize: 14.5, color: '#454A66' }}>{'Diffusion · ' + e.media}</div>}
              {!e.location && !e.city && !e.media && <div style={{ fontSize: 14.5, color: '#8B90A8' }}>Non communiqué.</div>}
            </div>
          </section>

          {e.candidates.length > 0 && (
            <section className="stk" style={{ gap: 10 }}>
              <h2 className="dsp" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{e.candidates.length + ' participant' + (e.candidates.length > 1 ? 's' : '')}</h2>
              <div className="card pop stk" style={{ gap: 10 }}>
                {e.candidates.map((c) => {
                  const cs = candidateStyle(c.name)
                  return (
                    <div key={c.slug} className="row sep" style={{ gap: 12, padding: '8px 0' }}>
                      <span style={{ width: 38, height: 38, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 800, color: '#fff', background: cs.color }}>{cs.initials}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: 13, color: '#5C617B' }}>{c.party}</div>
                      </div>
                      <span className="tag" style={{ background: cs.soft, color: cs.ink }}>{ROLE_LABEL[c.role] ?? c.role}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {e.source_name && (
            <div style={{ background: '#EFEBE2', borderRadius: 18, padding: '14px 16px', fontSize: 13.5, color: '#454A66' }}>
              {'Source · '}
              {e.source_url ? <a href={e.source_url} target="_blank" rel="noreferrer">{e.source_name}</a> : e.source_name}
            </div>
          )}
        </>
      )}
    </div>
  )
}
