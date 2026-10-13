// Invitations fermées par l'utilisateur (croix) : elles ne reviennent plus sur cet appareil.
export type PromptKind = 'install' | 'push'

const key = (k: PromptKind) => 'mpv_banner_closed_' + k

export function wasClosed(k: PromptKind): boolean {
  try {
    return localStorage.getItem(key(k)) === '1'
  } catch {
    return false
  }
}

export function markClosed(k: PromptKind) {
  try {
    localStorage.setItem(key(k), '1')
  } catch { /* storage unavailable */ }
}
