import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { isNative, nativePlatform } from './native'

// Initialisation des plugins natifs (no-op sur le web).
export function initNative() {
  if (!isNative) return
  document.documentElement.classList.add('native', `native-${nativePlatform}`)
  StatusBar.setStyle({ style: Style.Light }).catch(() => {})
  if (nativePlatform === 'android') {
    StatusBar.setBackgroundColor({ color: '#F5F0E6' }).catch(() => {})
  }
  // Le splash se masque après le premier rendu React (cf. main.tsx).
  requestAnimationFrame(() => SplashScreen.hide().catch(() => {}))
}
