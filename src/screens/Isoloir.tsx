import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { PAST_VOTES } from '../data'
import { gapPage, h1Size } from '../styles'
import Grid2 from '../components/Grid2'
import { ChevronRight, DebatIcon, FirstRoundIcon, VoteIcon } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Isoloir({ state: s, actions, isWeb }: Props) {
  const voteDone = s.voteChoice !== null
  const gap = gapPage(isWeb)

  const openVotes = [
    {
      key: 'vote', title: 'Vote du jour', sub: 'Ferme à 20h', tileBg: '#E3E7FF', tileFg: '#1F2A8A',
      tag: voteDone ? 'voté' : 'à voter', tagBg: voteDone ? '#DDF3E3' : '#FFEBC6', tagFg: voteDone ? '#14532D' : '#6E3A00',
      icon: <VoteIcon />, onClick: actions.openRoute('vote'),
    },
    {
      key: 'firstround', title: 'Mon vote du 1er tour', sub: "Sondage hebdomadaire, chaque dimanche", tileBg: '#FFEBC6', tileFg: '#6E3A00',
      tag: s.firstRoundPick !== null ? 'répondu' : 'à répondre', tagBg: s.firstRoundPick !== null ? '#DDF3E3' : '#FFEBC6', tagFg: s.firstRoundPick !== null ? '#14532D' : '#6E3A00',
      icon: <FirstRoundIcon />, onClick: actions.openRoute('firstround'),
    },
    {
      key: 'debat', title: 'Votes du débat de ce soir', sub: 'Avant, pendant et après', tileBg: '#FFDFD8', tileFg: '#8A1F0E',
      tag: '21h00', tagBg: '#FFDFD8', tagFg: '#8A1F0E',
      icon: <DebatIcon />, onClick: actions.openRoute('debat'),
    },
  ]

  const colA = (
    <>
      <section className="card" style={{ order: 1, padding: 6 }} aria-label="Votes ouverts">
        {openVotes.map((v) => (
          <button key={v.key} type="button" onClick={v.onClick} className="row sep rowh" style={{ width: '100%', gap: 12, minHeight: 72, padding: '10px 12px', borderRadius: 18 }}>
            <span style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.tileBg, color: v.tileFg }}>{v.icon}</span>
            <span style={{ flex: 1, minWidth: 0, display: 'block', textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, letterSpacing: '-.01em' }}>{v.title}</span>
              <span style={{ display: 'block', fontSize: 13, color: '#5C617B', marginTop: 2 }}>{v.sub}</span>
            </span>
            <span className="tag" style={{ background: v.tagBg, color: v.tagFg }}>{v.tag}</span>
            <ChevronRight size={18} color="#5C617B" />
          </button>
        ))}
      </section>

      <section style={{ order: 2 }} aria-label="Mes votes passés">
        <h2 className="dsp" style={{ margin: '6px 0 12px', fontSize: 22, fontWeight: 700 }}>Mes votes passés</h2>
        <div className="card" style={{ padding: '6px 18px' }}>
          {PAST_VOTES.map((p) => (
            <div key={p.title} className="row sep" style={{ gap: 12, minHeight: 58, padding: '10px 0' }}>
              <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 500, lineHeight: 1.3 }}>{p.title}</span>
              <span className="tag num" style={{ background: p.bg, color: p.fg }}>{p.result}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )

  const colB = (
    <section className="card" style={{ order: 3, background: '#E8E0FF', borderColor: '#D3C6FA', boxShadow: 'none' }}>
      <div className="row" style={{ gap: 10, marginBottom: 8 }}>
        <span style={{ width: 36, height: 36, borderRadius: 12, background: '#6B45D9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 20.5 12 12 21 3.5 12 12 3Z" /></svg>
        </span>
        <h2 className="dsp" style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#2E1A70' }}>Comment les points sont comptés</h2>
      </div>
      <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#3F238F' }}>Aucune mise, aucun argent. Participer rapporte peu, être juste rapporte beaucoup.</div>
    </section>
  )

  return (
    <div className="rise stk" style={{ gap }}>
      <div className="stk" style={{ gap: 8, marginBottom: 4 }}>
        <div className="eyebrow">Isoloir</div>
        <h1 className="dsp" style={{ margin: 0, fontWeight: 700, lineHeight: 1, fontSize: h1Size(isWeb) }}>Tes votes ouverts</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Ce qui est ouvert aujourd'hui, et ce qui est déjà tranché.</div>
      </div>
      <Grid2 isWeb={isWeb} gap={gap} colA={colA} colB={colB} />
    </div>
  )
}
