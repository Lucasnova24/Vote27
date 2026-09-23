import type { Tab } from '../types'
import { TABS } from '../data'
import { LogoDiamond, NavAgendaIcon, NavHomeIcon, NavIsoloirIcon, NavProfilIcon, QuizIcon } from './Icons'

interface Props {
  activeTab: Tab
  hasRoute: boolean
  go: (tab: Tab) => () => void
  accent: string
  name: string
  initials: string
  level: number
  levelPct: number
  levelLabel: string
}

const ORDER: { id: Tab; label: string; Icon: (p: { size?: number }) => JSX.Element }[] = [
  { id: 'accueil', label: 'Accueil', Icon: NavHomeIcon },
  { id: 'isoloir', label: 'Isoloir', Icon: NavIsoloirIcon },
  { id: 'agenda', label: 'Agenda', Icon: NavAgendaIcon },
  { id: 'quiz', label: 'Quiz', Icon: QuizIcon },
  { id: 'profil', label: 'Profil', Icon: NavProfilIcon },
]

export default function Sidebar({ activeTab, hasRoute, go, accent, name, initials, level, levelPct, levelLabel }: Props) {
  return (
    <nav aria-label="Navigation principale" style={{ flex: 'none', width: 236, background: '#171B3C', color: '#fff', padding: '24px 14px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="row" style={{ gap: 10, padding: '0 6px 22px' }}>
        <span style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: accent }}>
          <LogoDiamond size={18} />
        </span>
        <span className="dsp" style={{ fontSize: 22, fontWeight: 800 }}>Vote<span style={{ color: '#B8C0F5' }}>2027</span></span>
      </div>

      {ORDER.map(({ id, label, Icon }) => {
        const on = activeTab === id && !hasRoute
        const t = TABS[id]
        return (
          <button
            key={id}
            type="button"
            onClick={go(id)}
            className="nav"
            aria-current={on ? 'page' : 'false'}
            style={{ background: on ? 'rgba(255,255,255,.12)' : 'transparent', color: on ? '#fff' : '#B9BEDD' }}
          >
            <span style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? t.dark : 'transparent', color: on ? '#171B3C' : '#B9BEDD' }}>
              <Icon size={19} />
            </span>
            {label}
          </button>
        )
      })}

      <div style={{ flex: 1 }} />

      <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 18, padding: 14 }}>
        <div className="row" style={{ gap: 10, marginBottom: 12 }}>
          <span style={{ width: 38, height: 38, borderRadius: '50%', background: '#F0A03C', color: '#3A2200', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>
            {initials}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
            <div style={{ fontSize: 12, color: '#B9BEDD' }}>{'Niveau ' + level}</div>
          </div>
        </div>
        <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,.14)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 99, background: '#F0A03C', transition: 'width .5s ease', width: levelPct + '%' }} />
        </div>
        <div className="num" style={{ fontSize: 12, color: '#B9BEDD', marginTop: 8 }}>{levelLabel}</div>
      </div>
    </nav>
  )
}
