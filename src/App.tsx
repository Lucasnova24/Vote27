import { useEffect, useRef } from 'react'
import { useAppState } from './useAppState'
import { useIsWeb } from './useIsWeb'
import { ACCENT, SHOW_POINTS } from './data'
import { firstRoundCountdownLabel, todayLabelFr } from './lib/countdown'
import { getDisplayName, getInitials } from './lib/displayName'
import { levelFromPoints, levelProgress } from './lib/leveling'
import Auth from './screens/Auth'
import Accueil from './screens/Accueil'
import Isoloir from './screens/Isoloir'
import Agenda from './screens/Agenda'
import QuizTab from './screens/QuizTab'
import Profil from './screens/Profil'
import VoteScreen from './screens/VoteScreen'
import QuizRun from './screens/QuizRun'
import Boussole from './screens/Boussole'
import FirstRound from './screens/FirstRound'
import Debat from './screens/Debat'
import AgendaEvent from './screens/AgendaEvent'
import Programmes from './screens/Programmes'
import CompleteProfile from './screens/CompleteProfile'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import { LogoDiamond } from './components/Icons'

export default function App() {
  const { state: s, actions } = useAppState()
  const isWeb = useIsWeb()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [s.tab, s.route])

  if (s.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: '#F6F4EE', color: '#5C617B', fontSize: 13 }}>
        Chargement…
      </div>
    )
  }

  const displayName = getDisplayName(s)
  const initials = getInitials(displayName)
  const level = levelFromPoints(s.points)
  const { pct: levelPct, xpIntoLevel, xpTarget } = levelProgress(s.points)
  const levelLabel = xpIntoLevel + ' / ' + xpTarget + ' XP'
  const ptsLabel = s.points.toLocaleString('fr-FR')

  if (!s.authed) {
    return <Auth state={s} actions={actions} isWeb={isWeb} />
  }

  let screen
  if (s.route === 'vote') screen = <VoteScreen state={s} actions={actions} isWeb={isWeb} />
  else if (s.route === 'quiz') screen = <QuizRun state={s} actions={actions} isWeb={isWeb} />
  else if (s.route === 'boussole') screen = <Boussole state={s} actions={actions} isWeb={isWeb} />
  else if (s.route === 'firstround') screen = <FirstRound state={s} actions={actions} isWeb={isWeb} />
  else if (s.route === 'debat') screen = <Debat state={s} actions={actions} isWeb={isWeb} />
  else if (s.route === 'agendaEvent') screen = <AgendaEvent state={s} actions={actions} isWeb={isWeb} />
  else if (s.route === 'programmes') screen = <Programmes state={s} actions={actions} isWeb={isWeb} />
  else if (s.route === 'completeprofile') screen = <CompleteProfile state={s} actions={actions} isWeb={isWeb} />
  else if (s.tab === 'accueil') screen = <Accueil state={s} actions={actions} isWeb={isWeb} />
  else if (s.tab === 'isoloir') screen = <Isoloir state={s} actions={actions} isWeb={isWeb} />
  else if (s.tab === 'agenda') screen = <Agenda state={s} actions={actions} isWeb={isWeb} />
  else if (s.tab === 'quiz') screen = <QuizTab state={s} actions={actions} isWeb={isWeb} />
  else screen = <Profil state={s} actions={actions} isWeb={isWeb} />

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#F6F4EE', color: '#14162B', fontFamily: "'Hanken Grotesk',system-ui,sans-serif", overflow: 'hidden' }}>
      {isWeb && (
        <Sidebar
          activeTab={s.tab} hasRoute={!!s.route} go={actions.go}
          accent={ACCENT} name={displayName} initials={initials}
          level={level} levelPct={levelPct} levelLabel={levelLabel}
        />
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: isWeb ? '20px 40px 4px' : '12px 16px 6px' }}>
          {!isWeb && (
            <div className="row" style={{ gap: 9 }}>
              <span style={{ width: 34, height: 34, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT }}>
                <LogoDiamond size={17} />
              </span>
              <span className="dsp" style={{ fontSize: 21, fontWeight: 800 }}>Vote<span style={{ color: ACCENT }}>2027</span></span>
            </div>
          )}
          {isWeb && (
            <div className="row" style={{ gap: 10 }}>
              <span className="eyebrow">{todayLabelFr()}</span>
              <span className="tag" style={{ background: '#FFDFD8', color: '#8A1F0E' }}>{firstRoundCountdownLabel()}</span>
            </div>
          )}
          <div className="row" style={{ gap: 8 }}>
            {SHOW_POINTS && (
              <button type="button" onClick={actions.go('isoloir')} className="row lift" aria-label="Mes points" style={{ gap: 7, minHeight: 44, padding: '0 14px', background: '#fff', border: '1px solid #E7E2D6', borderRadius: 999 }}>
                <span style={{ color: '#E08A1E', fontSize: 14 }} aria-hidden="true">◆</span>
                <span className="dsp num" style={{ fontSize: 17, fontWeight: 700 }}>{ptsLabel}</span>
              </button>
            )}
            <button type="button" onClick={actions.go('profil')} aria-label="Mon profil" style={{ width: 44, height: 44, borderRadius: '50%', background: '#171B3C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '.03em' }}>
              {initials}
            </button>
          </div>
        </div>

        <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
          <div style={{ width: '100%', margin: '0 auto', padding: isWeb ? '20px 40px 56px' : '10px 16px 28px', maxWidth: isWeb ? 1100 : 'none' }}>
            {screen}
          </div>
        </div>

        {!isWeb && <BottomNav activeTab={s.tab} hasRoute={!!s.route} go={actions.go} />}
      </div>
    </div>
  )
}
