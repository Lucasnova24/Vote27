import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { LEAGUES } from '../data'
import { gapPage, h1Size } from '../styles'
import Grid2 from '../components/Grid2'
import { ChevronRight, QuizIcon } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function QuizTab({ state: s, actions, isWeb }: Props) {
  const gap = gapPage(isWeb)
  const rate = s.quizAttemptsTotal > 0 ? Math.round((s.quizCorrectTotal / s.quizAttemptsTotal) * 100) : 0

  const leagues = LEAGUES.concat(
    s.leagueCreated ? [{ badge: 'MOI', name: 'Ma nouvelle ligue', meta: '1 joueur', bg: '#171B3C', fg: '#FFFFFF' }] : [],
  )

  const colA = (
    <>
      <div style={{ order: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: s.quizDoneToday ? '#DDF3E3' : '#FFF4DA', border: '1px solid ' + (s.quizDoneToday ? '#8CC9A0' : '#F2DFAE'), borderRadius: 22, padding: '16px 18px' }}>
          <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
            <span className="row" style={{ gap: 8, color: s.quizDoneToday ? '#14532D' : '#6E3A00' }}>
              <QuizIcon size={18} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Aujourd'hui</span>
            </span>
            {s.quizDoneToday && (
              <span className="tag" style={{ background: 'rgba(255,255,255,.55)', color: '#14532D' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>Fait
              </span>
            )}
          </div>
          <div className="dsp num" style={{ fontSize: 30, fontWeight: 800, marginTop: 8, color: s.quizDoneToday ? '#14532D' : '#6E3A00' }}>
            {s.quizDoneToday ? s.quizScore + ' / 5' : 'à faire'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: '#EFEBE2', borderRadius: 22, padding: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#454A66' }}>Taux de bonne réponse</span>
            <div className="dsp num" style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: '#14162B' }}>{rate + ' %'}</div>
          </div>
          <div style={{ flex: 1, background: '#EFEBE2', borderRadius: 22, padding: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#454A66' }}>Bonnes réponses</span>
            <div className="dsp num" style={{ fontSize: 26, fontWeight: 800, marginTop: 8, color: '#14162B' }}>{String(s.quizCorrectTotal)}</div>
          </div>
        </div>
      </div>

      <section className="card" style={{ order: 2 }} aria-label="Quiz du jour">
        <h2 className="dsp" style={{ margin: 0, fontSize: 25, lineHeight: 1.08, fontWeight: 700 }}>Les institutions, en deux minutes</h2>
        <div style={{ fontSize: 14.5, lineHeight: 1.5, color: '#454A66', marginTop: 8 }}>{'Chaque bonne réponse rapporte 20 ◆ et renvoie à sa source.'}</div>
        <button type="button" onClick={actions.openRoute('quiz')} className="btn" style={{ marginTop: 16, background: '#A85400' }}>
          {s.quizDoneToday ? 'Revoir mes réponses' : 'Commencer'}
        </button>
      </section>
    </>
  )

  const colB = (
    <section style={{ order: 3 }} aria-label="Classements">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', margin: '6px 0 12px' }}>
        <h2 className="dsp" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Classements</h2>
        <span style={{ fontSize: 13, color: '#5C617B' }}>mis à jour à minuit</span>
      </div>
      <div className="card" style={{ padding: 6 }}>
        {leagues.map((l) => (
          <button key={l.name} type="button" className="row sep rowh" style={{ width: '100%', gap: 12, minHeight: 66, padding: '10px 12px', borderRadius: 18 }}>
            <span style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, background: l.bg, color: l.fg }}>{l.badge}</span>
            <span style={{ flex: 1, minWidth: 0, display: 'block', textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, letterSpacing: '-.01em' }}>{l.name}</span>
              <span style={{ display: 'block', fontSize: 13, color: '#5C617B', marginTop: 1 }}>{l.meta}</span>
            </span>
            <ChevronRight size={18} color="#5C617B" />
          </button>
        ))}
      </div>
      <button
        type="button" onClick={actions.createLeague} disabled={s.leagueCreated} className="btn"
        style={{ marginTop: 12, background: s.leagueCreated ? '#EFEBE2' : '#14162B', color: s.leagueCreated ? '#5C617B' : '#FFFFFF' }}
      >
        {s.leagueCreated ? 'Ligue créée ✓' : 'Créer une ligue'}
      </button>
    </section>
  )

  return (
    <div className="rise stk" style={{ gap }}>
      <div className="stk" style={{ gap: 8, marginBottom: 4 }}>
        <div className="eyebrow">Quiz</div>
        <h1 className="dsp" style={{ margin: 0, fontWeight: 700, lineHeight: 1, fontSize: h1Size(isWeb) }}>Cinq questions par jour</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Une seule tentative : sinon le classement n'a pas de sens.</div>
      </div>
      <Grid2 isWeb={isWeb} gap={gap} colA={colA} colB={colB} />
    </div>
  )
}
