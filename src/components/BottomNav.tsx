import type { ReactNode } from 'react'
import type { Tab } from '../types'

interface Props {
  activeTab: Tab
  hasRoute: boolean
  go: (tab: Tab) => () => void
}

const ICONS: Record<Tab, ReactNode> = {
  accueil: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3.5" y="3.5" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 8.5h13" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  isoloir: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="10" y="2.6" width="10.4" height="10.4" rx="2" transform="rotate(45 10 2.6)" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  agenda: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4.5" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 3v3M13.5 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  quiz: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10" cy="10" r="2.4" fill="currentColor" />
    </svg>
  ),
  profil: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 16.5c1-3 3-4.4 6-4.4s5 1.4 6 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
}

const LABELS: Record<Tab, string> = {
  accueil: 'Accueil', isoloir: 'Isoloir', agenda: 'Agenda', quiz: 'Quiz', profil: 'Profil',
}

export default function BottomNav({ activeTab, hasRoute, go }: Props) {
  return (
    <div
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        display: 'flex', background: 'rgba(238,240,247,.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #dfe3f0', padding: '9px 6px calc(10px + env(safe-area-inset-bottom))',
      }}
    >
      {(Object.keys(ICONS) as Tab[]).map((t) => {
        const active = activeTab === t && !hasRoute
        return (
          <div
            key={t}
            onClick={go(t)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 10, fontWeight: 600, letterSpacing: '.01em', color: active ? '#10162e' : '#8f97b4' }}
          >
            {ICONS[t]}
            {LABELS[t]}
          </div>
        )
      })}
    </div>
  )
}
