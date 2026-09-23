import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import type { AgendaRow } from '../lib/dbTypes'
import { AGENDA_FILTERS, CALENDAR, EVENT_CATEGORY_STYLE, RELIABILITY_STYLE } from '../data'
import { relativeDateLabel } from '../lib/countdown'
import { useAgenda } from '../lib/useAgenda'
import { debateStarted, tonightDebate, useNow } from '../lib/debate'
import { gapPage, h1Size } from '../styles'
import Grid2 from '../components/Grid2'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

const FILTER_TO_CATEGORY: Record<string, string | null> = {
  Tout: null, Débat: 'debat', Meeting: 'meeting', Interview: 'interview', Autre: 'autre',
}

const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

// What the date box shows, from most to least precise: the exact time,
// otherwise the day, otherwise the month — and the free label as a last resort.
function whenLabel(e: AgendaRow): { main: string; sub: string | null } {
  if (e.start_time && e.event_date && e.date_precision === 'exact') return { main: e.start_time.slice(0, 5), sub: null }
  if (e.event_date && (e.date_precision === 'exact' || e.date_precision === 'jour')) {
    const [, m, d] = e.event_date.split('-').map(Number)
    return { main: String(d), sub: MONTHS_SHORT[m - 1] }
  }
  let month: number | null = null
  let year: string | null = null
  if (e.event_date) {
    month = Number(e.event_date.slice(5, 7)) - 1
    year = e.event_date.slice(0, 4)
  } else {
    const label = e.display_date.toLowerCase()
    const i = MONTHS_FR.findIndex((m) => label.includes(m))
    if (i !== -1) {
      month = i
      year = label.match(/\b(20\d\d)\b/)?.[1] ?? null
    }
  }
  if (month !== null) return { main: MONTHS_SHORT[month], sub: year }
  return { main: e.display_date, sub: null }
}

function WhenBox({ e }: { e: AgendaRow }) {
  const cat = EVENT_CATEGORY_STYLE[e.category]
  const w = whenLabel(e)
  const short = w.main.length <= 6
  return (
    <div style={{ width: 64, flex: 'none', borderRadius: 14, padding: short ? '9px 0' : '9px 6px', textAlign: 'center', background: cat.soft, color: cat.ink }}>
      <div className={short ? 'dsp num' : undefined} style={{ fontSize: short ? 19 : 11, fontWeight: short ? 800 : 700, lineHeight: short ? 1 : 1.2 }}>{w.main}</div>
      {w.sub && <div style={{ fontSize: 11, fontWeight: 700, marginTop: 3 }}>{w.sub}</div>}
    </div>
  )
}

export default function Agenda({ state: s, actions, isWeb }: Props) {
  const gap = gapPage(isWeb)
  const events = useAgenda()
  const now = useNow()
  const tonight = tonightDebate(events, now)
  const tonightOpen = debateStarted(tonight, now)

  const filtered = (events ?? []).filter((e) => {
    if (e.status === 'passe') return false
    const cat = FILTER_TO_CATEGORY[s.filter]
    return cat === null || cat === undefined || e.category === cat
  })

  const dayKnown = (e: AgendaRow) => !!e.event_date && (e.date_precision === 'exact' || e.date_precision === 'jour')
  const dated = filtered.filter(dayKnown)
  const undated = filtered.filter((e) => !dayKnown(e))

  const days: { key: string; label: string; events: AgendaRow[] }[] = []
  dated.forEach((e) => {
    const key = e.event_date as string
    let d = days.find((x) => x.key === key)
    if (!d) {
      d = { key, label: relativeDateLabel(key), events: [] }
      days.push(d)
    }
    d.events.push(e)
  })

  const renderEvent = (e: AgendaRow) => {
    const cat = EVENT_CATEGORY_STYLE[e.category]
    const rel = RELIABILITY_STYLE[e.reliability]
    const on = s.reminders.indexOf(e.slug) !== -1
    const isLiveNow = tonightOpen && e.id === tonight?.id
    const who = e.candidates.length === 0
      ? null
      : e.candidates.length === 1
        ? e.candidates[0].name
        : e.candidates.length + ' candidats'
    return (
      <div key={e.id} className="row lift" style={{ gap: 14, padding: 14, background: '#fff', border: '1px solid #E7E2D6', borderRadius: 22, alignItems: 'flex-start' }}>
        <WhenBox e={e} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-.01em' }}>{e.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            <span className="tag" style={{ background: cat.soft, color: cat.ink }}>{cat.label}</span>
            {rel && <span className="tag" style={{ background: rel.soft, color: rel.ink }}>{rel.label}</span>}
            {(who || e.city) && <span style={{ fontSize: 13.5, color: '#5C617B' }}>{[who, e.city].filter(Boolean).join(' · ')}</span>}
          </div>
          {e.description && <div style={{ fontSize: 13.5, color: '#5C617B', marginTop: 6, lineHeight: 1.4 }}>{e.description}</div>}
          {isLiveNow && (
            <button type="button" onClick={actions.openDebate(e.slug)} className="row" style={{ gap: 8, marginTop: 6, minHeight: 44, fontSize: 14, fontWeight: 700, color: '#8A1F0E' }}>
              <span className="live" aria-hidden="true" />En direct · ouvrir la session
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          )}
          {e.source_name && (
            <div style={{ fontSize: 12, color: '#8B90A8', marginTop: 6 }}>
              {'Source · '}
              {e.source_url
                ? <a href={e.source_url} target="_blank" rel="noreferrer">{e.source_name}</a>
                : e.source_name}
            </div>
          )}
        </div>
        <button
          type="button" onClick={actions.toggleReminder(e.slug)} aria-pressed={on}
          aria-label={(on ? 'Annuler le rappel — ' : 'Me rappeler — ') + e.title} className="press"
          style={{ flex: 'none', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#3B4FD8' : '#F6F4EE', color: on ? '#fff' : '#5C617B' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15L6 16.5Z" /><path d="M10 20.5a2 2 0 0 0 4 0" />
          </svg>
        </button>
      </div>
    )
  }

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
        {events === null && <div style={{ fontSize: 13, color: '#5C617B' }}>Chargement…</div>}
        {events !== null && filtered.length === 0 && <div style={{ fontSize: 13, color: '#5C617B' }}>Aucun événement pour ce filtre.</div>}

        {days.map((d) => (
          <section key={d.key}>
            <h2 className="eyebrow" style={{ margin: '0 0 10px' }}>{d.label}</h2>
            <div className="stk" style={{ gap: 10 }}>{d.events.map(renderEvent)}</div>
          </section>
        ))}

        {undated.length > 0 && (
          <section>
            <h2 className="eyebrow" style={{ margin: '0 0 10px' }}>Dates à préciser</h2>
            <div className="stk" style={{ gap: 10 }}>
              {undated.map((e) => (
                <div key={e.id} className="row lift" style={{ gap: 14, padding: 14, background: '#fff', border: '1px solid #E7E2D6', borderRadius: 22, alignItems: 'flex-start' }}>
                  <WhenBox e={e} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-.01em' }}>{e.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                      <span className="tag" style={{ background: EVENT_CATEGORY_STYLE[e.category].soft, color: EVENT_CATEGORY_STYLE[e.category].ink }}>{EVENT_CATEGORY_STYLE[e.category].label}</span>
                      {RELIABILITY_STYLE[e.reliability] && <span className="tag" style={{ background: RELIABILITY_STYLE[e.reliability]!.soft, color: RELIABILITY_STYLE[e.reliability]!.ink }}>{RELIABILITY_STYLE[e.reliability]!.label}</span>}
                    </div>
                    {e.description && <div style={{ fontSize: 13.5, color: '#5C617B', marginTop: 6, lineHeight: 1.4 }}>{e.description}</div>}
                    {e.source_name && (
                      <div style={{ fontSize: 12, color: '#8B90A8', marginTop: 6 }}>
                        {'Source · '}
                        {e.source_url ? <a href={e.source_url} target="_blank" rel="noreferrer">{e.source_name}</a> : e.source_name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
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
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#454A66' }}>Événements réels, sourcés (LCP, Touteleurope, sites de campagne…), avec un niveau de fiabilité par événement. Certaines dates restent à confirmer.</div>
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
