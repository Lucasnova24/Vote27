import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { AGENDA_EVENTS, AGENDA_FILTERS, CALENDAR } from '../data'
import { h1, infoBox, mono, screenWrap, sectionLabel } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function Agenda({ state: s, actions }: Props) {
  const filtered = AGENDA_EVENTS.filter((e) => s.filter === 'Tout' || e.tag === s.filter)
  const days: { label: string; events: typeof filtered }[] = []
  filtered.forEach((e) => {
    let d = days.find((x) => x.label === e.day)
    if (!d) {
      d = { label: e.day, events: [] }
      days.push(d)
    }
    d.events.push(e)
  })

  return (
    <div style={screenWrap}>
      <div>
        <div style={sectionLabel}>Agenda</div>
        <h1 style={h1}>Campagne en direct</h1>
        <div style={{ fontSize: 13, color: '#6b7392' }}>Meetings, interviews, débats.</div>
      </div>

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {AGENDA_FILTERS.map((f) => {
          const active = s.filter === f
          return (
            <div
              key={f}
              onClick={actions.setFilter(f)}
              style={{ padding: '7px 13px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid', background: active ? '#1b2a63' : '#fff', color: active ? '#fff' : '#4d5680', borderColor: active ? '#1b2a63' : '#dde1ee' }}
            >
              {f}
            </div>
          )
        })}
      </div>

      {days.map((d) => (
        <div key={d.label}>
          <div style={{ ...sectionLabel, margin: '6px 0 8px' }}>{d.label}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {d.events.map((e) => (
              <div
                key={e.title + e.time}
                onClick={e.live ? actions.openRoute('debat') : undefined}
                style={{ display: 'flex', gap: 12, padding: '13px 14px', background: '#fff', border: '1px solid #e3e7f3', borderRadius: 14, cursor: e.live ? 'pointer' : 'default', borderLeft: '3px solid ' + (e.live ? '#c02742' : '#dde1ee') }}
              >
                <div style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 600, width: 44, flex: 'none', paddingTop: 1 }}>{e.time}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-.01em', lineHeight: 1.3 }}>{e.title}</div>
                  <div style={{ fontSize: 11.5, color: '#6b7392', marginTop: 2 }}>{e.who}</div>
                </div>
                <div style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, alignSelf: 'flex-start', padding: '3px 7px', borderRadius: 6, background: '#eef0f7', color: '#4d5680' }}>{e.tag}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: '#1b2a63', color: '#fff', borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a8b3d8', fontWeight: 500, marginBottom: 10 }}>
          Calendrier officiel du scrutin
        </div>
        {CALENDAR.map((k) => (
          <div key={k.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderTop: '1px solid rgba(255,255,255,.12)' }}>
            <div style={{ fontSize: 13 }}>{k.label}</div>
            <div style={{ fontFamily: mono, fontSize: 12.5, color: '#c3cbe8' }}>{k.when}</div>
          </div>
        ))}
      </div>

      <div style={infoBox}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>D'où vient cet agenda</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#4d5680' }}>
          Agendas des équipes de campagne, grilles des chaînes, annonces officielles. Tous les candidats déclarés, même format, aucun tri par popularité.
        </div>
        <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: '#4d5680', textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer' }}>
          Signaler un événement manquant
        </div>
      </div>
    </div>
  )
}
