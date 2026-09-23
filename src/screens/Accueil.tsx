import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, CANDS, EVENT_CATEGORY_STYLE } from '../data'
import { firstRoundCountdownLabel, relativeDateLabel, todayLabelFr } from '../lib/countdown'
import { useAgenda } from '../lib/useAgenda'
import { debateStarted, tonightDebate, useNow } from '../lib/debate'
import { gapPage, h1Size } from '../styles'
import Grid2 from '../components/Grid2'
import StatusTag from '../components/StatusTag'
import { BellIcon, BoussoleIcon, ChevronRight, CheckIcon, FirstRoundIcon, QuizIcon, VoteIcon } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Accueil({ state: s, actions, isWeb }: Props) {
  const voteDone = s.voteChoice !== null
  const gap = gapPage(isWeb)
  const agendaEvents = useAgenda()
  const now = useNow()

  const rawTodos = [
    { k: 'vote' as const, title: 'Vote du jour', sub: '1 min', done: voteDone, onClick: actions.openRoute('vote'), chipBg: '#E3E7FF', chipFg: '#1F2A8A' },
    { k: 'quiz' as const, title: 'Quiz du jour', sub: '5 questions · 2 min', done: s.quizDoneToday, onClick: actions.openRoute('quiz'), chipBg: '#FFEBC6', chipFg: '#6E3A00' },
    { k: 'fr' as const, title: 'Mon vote du 1er tour', sub: 'Sondage hebdomadaire', done: s.firstRoundPick !== null, onClick: actions.openRoute('firstround'), chipBg: '#FFEBC6', chipFg: '#6E3A00' },
    { k: 'bou' as const, title: 'Mes affinités', sub: '20 ou 100 questions', done: s.bDone, onClick: actions.openRoute('boussole'), chipBg: '#E8E0FF', chipFg: '#3F238F' },
  ]
  const todos = rawTodos.slice().sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
  const doneCount = todos.filter((t) => t.done).length
  const ringOffset = (157.08 * (1 - doneCount / todos.length)).toFixed(2)

  const upcoming = (agendaEvents ?? [])
    .filter((e) => e.event_date && (e.status === 'en_cours' || e.status === 'a_venir'))
    .slice()
    .sort((a, b) => (a.event_date! + (a.start_time ?? '99:99')).localeCompare(b.event_date! + (b.start_time ?? '99:99')))
  const nextEvt = upcoming[0] ?? null
  const nextCat = nextEvt ? EVENT_CATEGORY_STYLE[nextEvt.category] : null
  // Only send people to the debate vote once tonight's debate has started.
  const nextLive = !!nextEvt && tonightDebate(agendaEvents, now)?.id === nextEvt.id && debateStarted(nextEvt, now)
  const nextBg = nextLive ? '#FFDFD8' : nextCat?.soft ?? '#FFDFD8'
  const nextBc = nextLive ? '#F5C2B7' : '#E7E2D6'
  const nextInk = nextLive ? '#8A1F0E' : nextCat?.ink ?? '#454A66'
  const nextTitleColor = nextLive ? '#3D0E06' : '#14162B'
  const nextBtnBg = nextLive ? '#C8341C' : '#14162B'
  const nextIsDebate = nextEvt?.category === 'debat'
  const nextCta = nextLive ? 'Suivre le débat' : nextIsDebate ? 'Voir le débat' : "Voir dans l'agenda"
  const nextClick = nextIsDebate ? actions.openDebate(nextEvt!.slug) : actions.go('agenda')

  const colA = (
    <>
      <section className="card" style={{ order: 1 }} aria-label="To do">
        <div className="row" style={{ gap: 14, marginBottom: 16 }}>
          <div style={{ position: 'relative', width: 60, height: 60, flex: 'none' }}>
            <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="25" fill="none" stroke="#EFEBE2" strokeWidth={7} />
              <circle className="ring" cx="30" cy="30" r="25" fill="none" stroke={ACCENT} strokeWidth={7} strokeLinecap="round" strokeDasharray="157.08" style={{ strokeDashoffset: ringOffset }} transform="rotate(-90 30 30)" />
            </svg>
            <span className="dsp num" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800 }}>{doneCount + ' / ' + todos.length}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="dsp" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>To do</h2>
          </div>
        </div>
        <div className="stk" style={{ gap: 8 }}>
          {todos.map((t) => (
            <button
              key={t.k} type="button" onClick={t.onClick} className="lift row"
              style={{
                width: '100%', gap: t.done ? 10 : 12, minHeight: t.done ? 46 : 68, padding: t.done ? '4px 10px' : '10px 12px',
                border: '1px solid #EDE9DF', borderRadius: 18, background: t.done ? '#F5FAF6' : '#FBFAF6',
              }}
            >
              <span style={{ width: t.done ? 30 : 44, height: t.done ? 30 : 44, borderRadius: t.done ? 10 : 14, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.done ? '#DDF3E3' : t.chipBg, color: t.done ? '#14532D' : t.chipFg }}>
                {t.k === 'vote' && <VoteIcon size={t.done ? 16 : 22} />}
                {t.k === 'quiz' && <QuizIcon size={t.done ? 16 : 22} />}
                {t.k === 'fr' && <FirstRoundIcon size={t.done ? 16 : 22} />}
                {t.k === 'bou' && <BoussoleIcon size={t.done ? 16 : 22} />}
              </span>
              <span style={{ flex: 1, minWidth: 0, display: 'block', textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: t.done ? 14 : 15.5, fontWeight: 700, letterSpacing: '-.01em' }}>{t.title}</span>
                {!t.done && <span style={{ display: 'block', fontSize: 13, color: '#5C617B', marginTop: 1 }}>{t.sub}</span>}
              </span>
              {t.done ? (
                <span className="tag" style={{ background: '#DDF3E3', color: '#14532D' }}><CheckIcon />Fait</span>
              ) : (
                <span className="row" style={{ gap: 2, fontSize: 13.5, fontWeight: 700, color: t.chipFg }}>Y aller<ChevronRight size={16} /></span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="card" style={{ order: 4 }} aria-label="Candidats">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <h2 className="dsp" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Candidats à la présidentielle</h2>
          <span style={{ fontSize: 13, color: '#5C617B' }}>{CANDS.length}</span>
        </div>
        <div className="stk" style={{ maxHeight: 360, overflowY: 'auto' }}>
          {CANDS.map((c) => (
            <div key={c.name} className="row sep" style={{ gap: 12, padding: '11px 0' }}>
              <span style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
              <span style={{ flex: 1, minWidth: 0, display: 'block' }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                <span style={{ display: 'block', fontSize: 13, color: '#5C617B' }}>{c.party}</span>
              </span>
              <StatusTag status={c.status} />
            </div>
          ))}
        </div>
      </section>
    </>
  )

  const colB = (
    <>
      {nextEvt && (
        <button type="button" onClick={nextClick} className="lift" style={{ order: 2, display: 'block', width: '100%', textAlign: 'left', background: nextBg, border: '1px solid ' + nextBc, borderRadius: 22, padding: 18 }}>
          <span className="row" style={{ gap: 8 }}>
            {nextLive && <span className="live" aria-hidden="true" />}
            <span className="eyebrow" style={{ color: nextInk }}>{'Prochain évènement · ' + nextCat!.label}</span>
          </span>
          <span className="dsp" style={{ display: 'block', fontSize: 26, lineHeight: 1.05, fontWeight: 700, marginTop: 12, color: nextTitleColor }}>{nextEvt.title}</span>
          <span className="num" style={{ display: 'block', fontSize: 14.5, color: nextInk, marginTop: 6 }}>
            {relativeDateLabel(nextEvt.event_date as string) + (nextEvt.start_time ? ' · ' + nextEvt.start_time.slice(0, 5) : '')}
          </span>
          <span className="btn" style={{ marginTop: 16, background: nextBtnBg }}>{nextCta}<ChevronRight size={16} /></span>
        </button>
      )}

      <button type="button" onClick={actions.openRoute('programmes')} className="press" style={{ order: 3, display: 'block', width: '100%', textAlign: 'left', background: '#171B3C', color: '#fff', borderRadius: 22, padding: 20 }}>
        <span className="row" style={{ gap: 12, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="dsp" style={{ display: 'block', fontSize: 25, lineHeight: 1.05, fontWeight: 700, maxWidth: 230 }}>Les programmes, côte à côte</span>
          <span style={{ display: 'flex', paddingLeft: 10, flex: 'none' }} aria-hidden="true">
            {CANDS.slice(0, 5).map((c) => <span key={c.name} style={{ width: 30, height: 30, borderRadius: '50%', border: '2.5px solid #171B3C', marginLeft: -10, background: c.color }} />)}
          </span>
        </span>
        <span style={{ display: 'block', fontSize: 14.5, lineHeight: 1.5, color: '#B9BEDD', marginTop: 10 }}>Six thèmes, tous les candidats déclarés, une source vérifiable pour chaque position.</span>
        <span className="btn" style={{ marginTop: 16, background: '#fff', color: '#171B3C' }}>Lire les programmes<ChevronRight size={16} /></span>
      </button>

      <section className="card" style={{ order: 5, background: '#D8EBFB', borderColor: '#B7D6F0', boxShadow: 'none' }} aria-label="Notifications">
        <div className="row" style={{ gap: 10, justifyContent: 'space-between' }}>
          <span className="row" style={{ gap: 10 }}>
            <span style={{ width: 36, height: 36, borderRadius: 12, background: '#0B6BB8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BellIcon /></span>
            <span className="eyebrow" style={{ color: '#0A4577' }}>Notifications</span>
          </span>
          <span className="tag" style={{ background: '#fff', color: '#0A4577' }}>{s.notifRead ? 'à jour' : '2 nouvelles'}</span>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.5, marginTop: 12, color: '#0A2F52' }}>Le vote du jour ferme à 20h.</div>
        <button type="button" onClick={actions.markRead} style={{ marginTop: 6, minHeight: 44, fontSize: 14, fontWeight: 700, color: '#0A4577', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Marquer comme lues</button>
      </section>
    </>
  )

  return (
    <div className="rise stk" style={{ gap }}>
      <div className="stk" style={{ gap: 8, marginBottom: 4 }}>
        <div className="eyebrow">{todayLabelFr() + ' · ' + firstRoundCountdownLabel()}</div>
        <h1 className="dsp" style={{ margin: 0, fontWeight: 700, lineHeight: 1, fontSize: h1Size(isWeb) }}>Accueil</h1>
      </div>
      <Grid2 isWeb={isWeb} gap={gap} colA={colA} colB={colB} />
    </div>
  )
}
