import { useAppState } from './useAppState'
import { useIsWeb } from './useIsWeb'
import { SHOW_POINTS } from './data'
import { getDisplayName, getInitials } from './lib/displayName'
import { levelFromPoints } from './lib/leveling'
import Auth from './screens/Auth'
import Accueil from './screens/Accueil'
import Isoloir from './screens/Isoloir'
import Agenda from './screens/Agenda'
import QuizTab from './screens/QuizTab'
import Profil from './screens/Profil'
import VoteScreen from './screens/VoteScreen'
import QuizRun from './screens/QuizRun'
import Boussole from './screens/Boussole'
import Estimation from './screens/Estimation'
import Debat from './screens/Debat'
import Programmes from './screens/Programmes'
import TopNav from './components/TopNav'
import BottomNav from './components/BottomNav'
import HeaderCard from './components/HeaderCard'

export default function App() {
  const { state: s, actions } = useAppState()
  const isWeb = useIsWeb()

  if (s.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#eef0f7', color: '#6b7392', fontSize: 13 }}>
        Chargement…
      </div>
    )
  }

  const maxW = isWeb ? 720 : 'none'
  const headPad = isWeb ? '14px 20px 12px' : '14px 16px 12px'
  const displayName = getDisplayName(s)

  let screen
  if (s.route === 'vote') screen = <VoteScreen state={s} actions={actions} />
  else if (s.route === 'quiz') screen = <QuizRun state={s} actions={actions} />
  else if (s.route === 'boussole') screen = <Boussole state={s} actions={actions} />
  else if (s.route === 'estimation') screen = <Estimation state={s} actions={actions} />
  else if (s.route === 'debat') screen = <Debat state={s} actions={actions} />
  else if (s.route === 'programmes') screen = <Programmes state={s} actions={actions} />
  else if (s.tab === 'accueil') screen = <Accueil state={s} actions={actions} />
  else if (s.tab === 'isoloir') screen = <Isoloir state={s} actions={actions} />
  else if (s.tab === 'agenda') screen = <Agenda state={s} actions={actions} />
  else if (s.tab === 'quiz') screen = <QuizTab state={s} actions={actions} />
  else screen = <Profil state={s} actions={actions} />

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#eef0f7', color: '#10162e' }}>
      {!s.authed && <Auth state={s} actions={actions} />}

      {s.authed && (
        <>
          {isWeb && <TopNav activeTab={s.tab} hasRoute={!!s.route} go={actions.go} maxW={maxW} />}

          <HeaderCard
            onOpenProfil={actions.go('profil')}
            showPoints={SHOW_POINTS}
            pts={s.points}
            headPad={headPad}
            maxW={maxW}
            sticky={!isWeb}
            name={displayName}
            initials={getInitials(displayName)}
            level={levelFromPoints(s.points)}
            boussoleDone={s.bDone}
          />

          <div
            style={{
              flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
              paddingBottom: isWeb ? 0 : 78,
            }}
          >
            {screen}
          </div>

          {!isWeb && <BottomNav activeTab={s.tab} hasRoute={!!s.route} go={actions.go} />}
        </>
      )}
    </div>
  )
}
