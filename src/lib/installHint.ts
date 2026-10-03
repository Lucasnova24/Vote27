const KEY = 'pv_install_hint'

const read = () => {
  try { return window.localStorage.getItem(KEY) } catch { return null }
}
const write = (v: string) => {
  try { window.localStorage.setItem(KEY, v) } catch { /* storage indisponible */ }
}

// Appelé à l'inscription : le conseil s'affichera une fois le compte connecté.
export const queueInstallHint = () => { if (read() === null) write('pending') }
export const shouldShowInstallHint = () => read() === 'pending'
export const dismissInstallHint = () => write('done')

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
