import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { AGENDA_FILTERS, CALENDAR, EVENTS, EVENT_TAGS } from '../data'
import { relativeDayLabel } from '../lib/countdown'
import { gapPage, h1Size } from '../styles'
import Grid2 from '../components/Grid2'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Agenda({ state: s, actions, isWeb }: Props) {
  const gap = gapPage(isWeb)
  const filtered = EVENTS.filter((e) => s.filter === 'Tout' || e.tag === s.filter)
  const days: { offset: number; label: string; events: typeof filtered }[] = []
  filtered.forEach((e) => {
    let d = days.find((x) => x.offset === e.dayOffset)
    if (!d) {
      d = { offset: e.dayOffset, label: relativeDayLabel(e.dayOffset), events: [] }
      days.push(d)
    }
    d.events.push(e)
  })

  const colA = (
    <>
      <div role="group" aria-label="Filtrer par type" style={{ order: 1, display: 'flex', gap: 8, overflowX: 'auto', margin: isWeb ? 0 : '0 -16px', padding: isWeb ? 0 : '0 16px' }}>
        {AGENDA_FILTERS.map((f) => {
          const active = s.filter === f
          return (
            <button key={f} type="button" onClick={actions.setFilter(f)} className="chip" aria-pressed={active} style={{ background: active ? '#14162B' : '#fff', color: active ? '#fff' : '#454A66', borderColor: active ? '#14162B' : '#DDD7C9' }}>
              {f}
            </button>
          )
        })}
      </div>

      <div className="stk" style={{ order: 2, gap: 20 }}>
        {days.map((d) => (
          <section key={d.label}>
            <h2 className="eyebrow" style={{ margin: '0 0 10px' }}>{d.label}</h2>
            <div className="stk" style={{ gap: 10 }}>
              {d.events.map((e) => {
                const tg = EVENT_TAGS[e.tag]
                const on = s.reminders.indexOf(e.title) !== -1
                return (
                  <div key={e.title + e.time} className="row lift" style={{ gap: 14, padding: 14, background: '#fff', border: '1px solid #E7E2D6', borderRadius: 22, alignItems: 'flex-start' }}>
                    <div style={{ width: 64, flex: 'none', borderRadius: 14, padding: '9px 0', textAlign: 'center', background: tg.soft, color: tg.ink }}>
                      <div className="dsp num" style={{ fontSize: 19, fontWeight: 800, lineHeight: 1 }}>{e.time}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-.01em' }}>{e.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                        <span className="tag" style={{ background: tg.soft, color: tg.ink }}>{e.tag}</span>
                        <span style={{ fontSize: 13.5, color: '#5C617B' }}>{e.who}</span>
                      </div>
                      {e.live && (
                        <button type="button" onClick={actions.openRoute('debat')} className="row" style={{ gap: 8, marginTop: 6, minHeight: 44, fontSize: 14, fontWeight: 700, color: '#8A1F0E' }}>
                          <span className="live" aria-hidden="true" />En direct · ouvrir la session
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
                        </button>
                      )}
                    </div>
                    <button
                      type="button" onClick={actions.toggleReminder(e.title)} aria-pressed={on}
                      aria-label={(on ? 'Annuler le rappel — ' : 'Me rappeler — ') + e.title} className="press"
                      style={{ flex: 'none', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#3B4FD8' : '#F6F4EE', color: on ? '#fff' : '#5C617B' }}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15L6 16.5Z" /><path d="M10 20.5a2 2 0 0 0 4 0" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  )

  const colB = (
    <>
      <section className="card" style={{ order: 3, background: '#171B3C', borderColor: '#171B3C', color: '#fff' }} aria-label="Calendrier officiel du scrutin">
        <h2 className="eyebrow" style={{ margin: '0 0 16px', color: '#A7ADD3' }}>Calendrier officiel du scrutin</h2>
        <div className="stk">
          {CALENDAR.map((k, i) => (
            <div key={k.label} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', flex: 'none', border: '3px solid', background: '#171B3C', borderColor: k.dot }} />
                <span style={{ flex: 1, width: 2, marginTop: 4, background: 'rgba(255,255,255,.18)', display: i < CALENDAR.length - 1 ? 'block' : 'none' }} />
              </div>
              <div style={{ paddingBottom: 20 }}>
                <div className="dsp" style={{ fontSize: 22, lineHeight: 1.1, fontWeight: 700 }}>{k.when}</div>
                <div style={{ fontSize: 14.5, color: '#B9BEDD', marginTop: 3 }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ order: 4, background: '#EFEBE2', borderColor: '#E2DCCD', boxShadow: 'none' }}>
        <h2 className="dsp" style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 700 }}>D'où vient cet agenda</h2>
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#454A66' }}>Agendas des équipes de campagne, grilles des chaînes, annonces officielles. Tous les candidats déclarés, même format, aucun tri par popularité.</div>
        <button type="button" style={{ marginTop: 6, minHeight: 44, fontSize: 14, fontWeight: 700, color: '#14162B', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Signaler un événement manquant</button>
      </section>
    </>
  )

  return (
    <div className="rise stk" style={{ gap }}>
      <div className="stk" style={{ gap: 8, marginBottom: 4 }}>
        <div className="eyebrow">Agenda</div>
        <h1 className="dsp" style={{ margin: 0, fontWeight: 700, lineHeight: 1, fontSize: h1Size(isWeb) }}>Campagne en direct</h1>
        <div style={{ fontSize: 15, color: '#454A66' }}>Meetings, interviews, débats.</div>
      </div>
      <Grid2 isWeb={isWeb} gap={gap} colA={colA} colB={colB} />
    </div>
  )
}
