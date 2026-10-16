import { useEffect, useState } from 'react'
import { enablePush, getPushStatus, syncPushSubscription, type PushStatus } from '../lib/push'
import { isStandalone } from '../lib/install'
import { markClosed, wasClosed } from '../lib/dismissed'

// Fenêtre affichée au lancement de l'appli depuis l'écran d'accueil : un appui sur le bouton
// déclenche la demande d'autorisation du téléphone. Une seule fois (croix pour la fermer) ;
// elle ne s'affiche pas si les notifications sont déjà activées, bloquées ou non supportées.
export default function NotificationsPrompt() {
  const [status, setStatus] = useState<PushStatus | null>(null)
  const [closed, setClosed] = useState(() => wasClosed('push'))
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    getPushStatus().then((st) => active && setStatus(st))
    syncPushSubscription()
    return () => {
      active = false
    }
  }, [])

  if (closed || status !== 'off' || !isStandalone()) return null

  const close = () => {
    markClosed('push')
    setClosed(true)
  }

  const activate = async () => {
    setBusy(true)
    setFailed(false)
    try {
      const next = await enablePush()
      setStatus(next)
      // Autorisé → la fenêtre disparaît (status 'on'). Refusé → on ne redemande pas.
      if (next !== 'off') markClosed('push')
    } catch (e) {
      console.error('[push]', e)
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 16, background: 'rgba(20,22,43,.5)' }}>
      <div role="dialog" aria-modal="true" aria-label="Activer les notifications" className="stk" style={{ position: 'relative', gap: 14, width: '100%', maxWidth: 420, background: '#fff', borderRadius: 24, padding: '28px 22px 22px', marginBottom: 'env(safe-area-inset-bottom)' }}>
        <button type="button" onClick={close} aria-label="Fermer" style={{ position: 'absolute', top: 6, right: 6, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5C617B' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div style={{ fontSize: 40, lineHeight: 1 }} aria-hidden="true">🔔</div>
        <div className="dsp" style={{ fontSize: 24, lineHeight: 1.15, fontWeight: 700 }}>Active les notifications</div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: '#454A66' }}>
          Reçois un rappel pour la question du jour, les événements de l'agenda et le vote de la semaine. Un seul appui, puis « Autoriser ».
        </div>
        <button type="button" className="btn" disabled={busy} onClick={activate} style={{ background: '#171B3C', color: '#fff' }}>
          {busy ? 'Activation…' : 'Activer les notifications'}
        </button>
        {failed && <div style={{ fontSize: 13, color: '#B0301A' }}>Impossible d'activer pour le moment. Réessaie dans un instant.</div>}
      </div>
    </div>
  )
}
