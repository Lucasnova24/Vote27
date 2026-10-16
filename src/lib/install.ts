import { isNative } from './native'

const KEY = 'mpv_install_pending'

export function isStandalone() {
  if (typeof window === 'undefined') return false
  // L'app native est déjà « installée » : pas de tuto d'ajout à l'écran d'accueil.
  if (isNative) return true
  return window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
}

export function isIOS() {
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
}

export function markInstallPending() {
  try { localStorage.setItem(KEY, '1') } catch { /* storage unavailable */ }
}

export function installPending() {
  try { return localStorage.getItem(KEY) === '1' && !isStandalone() } catch { return false }
}

export function clearInstallPending() {
  try { localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
}
