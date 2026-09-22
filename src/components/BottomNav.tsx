import type { Tab } from '../types'
import { TABS } from '../data'
import { NavAgendaIcon, NavHomeIcon, NavIsoloirIcon, NavProfilIcon, QuizIcon } from './Icons'

interface Props {
  activeTab: Tab
  hasRoute: boolean
  go: (tab: Tab) => () => void
}

const ORDER: { id: Tab; label: string; Icon: (p: { size?: number }) => JSX.Element }[] = [
  { id: 'accueil', label: 'Accueil', Icon: NavHomeIcon },
  { id: 'isoloir', label: 'Isoloir', Icon: NavIsoloirIcon },
  { id: 'agenda', label: 'Agenda', Icon: NavAgendaIcon },
  { id: 'quiz', label: 'Quiz', Icon: QuizIcon },
  { id: 'profil', label: 'Profil', Icon: NavProfilIcon },
]

export default function BottomNav({ activeTab, hasRoute, go }: Props) {
  return (
    <nav
      aria-label="Navigation principale"
      style={{
        flex: 'none', display: 'flex', padding: '6px 6px calc(14px + env(safe-area-inset-bottom))',
        background: 'rgba(255,255,255,.94)', borderTop: '1px solid #E7E2D6', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      {ORDER.map(({ id, label, Icon }) => {
        const on = activeTab === id && !hasRoute
        const t = TABS[id]
        return (
          <button
            key={id}
            type="button"
            onClick={go(id)}
            className="tab"
            aria-current={on ? 'page' : 'false'}
            style={{ color: on ? '#14162B' : '#5C617B' }}
          >
            <span className="pill" style={{ background: on ? t.soft : 'transparent', color: on ? t.ink : '#5C617B' }}>
              <Icon size={22} />
            </span>
            {label}
          </button>
        )
      })}
    </nav>
  )
}
