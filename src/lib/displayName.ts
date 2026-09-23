import type { AppState } from '../types'

export function getDisplayName(s: Pick<AppState, 'authFirst' | 'authLast' | 'authPseudo' | 'authEmail' | 'authProvider'>): string {
  if (s.authPseudo) return s.authPseudo
  const full = `${s.authFirst} ${s.authLast}`.trim()
  if (full) return full
  if (s.authProvider === 'anonymous') return 'Invité'
  return s.authEmail || 'Mon compte'
}

export function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return initials || '·'
}
