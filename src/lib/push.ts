import { supabase } from './supabaseClient'
import { isNative } from './native'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined

export type PushStatus =
  | 'unsupported'   // navigateur sans Web Push
  | 'needs-install' // iPhone/iPad : l'app doit d'abord être ajoutée à l'écran d'accueil
  | 'denied'        // permission refusée dans le navigateur
  | 'off'           // possible mais pas (encore) activé
  | 'on'            // activé sur cet appareil

function isIos(): boolean {
  const ua = navigator.userAgent
  // iPadOS se présente comme un Mac avec écran tactile.
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
}

function pushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && !!VAPID_PUBLIC_KEY
}

// Web Push / service worker : web uniquement (pas d'enregistrement en natif Capacitor).
export function registerServiceWorker() {
  if (isNative) return
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((e) => console.error('[push] service worker:', e))
  })
}

export async function getPushStatus(): Promise<PushStatus> {
  if (isNative) return 'unsupported'
  if (isIos() && !isStandalone()) return 'needs-install'
  if (!pushSupported()) return 'unsupported'
  if (Notification.permission === 'denied') return 'denied'
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  return sub && Notification.permission === 'granted' ? 'on' : 'off'
}

function urlBase64ToUint8Array(b64: string): Uint8Array {
  const padded = (b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(padded)
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

async function saveSubscription(sub: PushSubscription): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Pas de session')
  const json = sub.toJSON()
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user.id,
      endpoint: sub.endpoint,
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
      user_agent: navigator.userAgent.slice(0, 250),
    },
    { onConflict: 'endpoint' },
  )
  if (error) throw error
}

// À appeler depuis un geste de l'utilisateur (obligatoire sur iOS).
export async function enablePush(): Promise<PushStatus> {
  if (!pushSupported()) return getPushStatus()
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return getPushStatus()
  const reg = await navigator.serviceWorker.ready
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!) as BufferSource,
    }))
  await saveSubscription(sub)
  return 'on'
}

export async function disablePush(): Promise<PushStatus> {
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  if (sub) {
    await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
    await sub.unsubscribe()
  }
  return getPushStatus()
}

// Une fois activé, rattache l'abonnement au compte courant (ex. après une
// reconnexion ou la création d'un compte depuis une session invitée).
export async function syncPushSubscription(): Promise<void> {
  try {
    if ((await getPushStatus()) !== 'on') return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) await saveSubscription(sub)
  } catch (e) {
    console.error('[push] sync:', e)
  }
}
