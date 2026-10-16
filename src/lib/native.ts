import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Share } from '@capacitor/share'
import appConfig from '../../app.config.json'

export const isNative = Capacitor.isNativePlatform()
export const nativePlatform = Capacitor.getPlatform() // 'ios' | 'android' | 'web'

// Schéma d'URL personnalisé de l'app (dérivé de l'identifiant d'application) :
// c'est l'URL de retour OAuth à ajouter dans Supabase > Redirect URLs.
export const OAUTH_REDIRECT_URL = `${appConfig.appId}://auth-callback`

// Retours haptiques : sans effet (et sans erreur) sur le web.
export function hapticTap() {
  if (!isNative) return
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
}

export function hapticSuccess() {
  if (!isNative) return
  Haptics.notification({ type: NotificationType.Success }).catch(() => {})
}

export function hapticError() {
  if (!isNative) return
  Haptics.notification({ type: NotificationType.Error }).catch(() => {})
}

// Partage natif (feuille de partage iOS/Android) ; Web Share API sinon ;
// presse-papiers en dernier recours. Renvoie false si rien n'a pu être partagé.
export async function shareText(title: string, text: string, url?: string): Promise<boolean> {
  try {
    if (isNative) {
      await Share.share({ title, text, url, dialogTitle: title })
      return true
    }
    if (navigator.share) {
      await navigator.share({ title, text, url })
      return true
    }
    await navigator.clipboard.writeText(url ? `${text} ${url}` : text)
    return true
  } catch {
    return false
  }
}

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
