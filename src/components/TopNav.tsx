import type { Tab } from '../types'
import { serif } from '../styles'

interface Props {
  activeTab: Tab
  hasRoute: boolean
  go: (tab: Tab) => () => void
  maxW: number | 'none'
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'isoloir', label: 'Isoloir' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'profil', label: 'Profil' },
]

export default function TopNav({ activeTab, hasRoute, go, maxW }: Props) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, flex: 'none', background: 'rgba(238,240,247,.94)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #dfe3f0' }}>
      <div style={{ maxWidth: maxW, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 4, padding: '10px 20px' }}>
        <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, letterSpacing: '-.02em', marginRight: 14 }}>
          Vote<span style={{ color: '#2f4bb0' }}>2027</span>
        </div>
        {TABS.map((t) => {
          const active = activeTab === t.id && !hasRoute
          return (
            <div
              key={t.id}
              onClick={go(t.id)}
              style={{
                padding: '7px 12px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                color: active ? '#10162e' : '#8f97b4',
                background: active ? '#e1e6f4' : 'transparent',
              }}
            >
              {t.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
