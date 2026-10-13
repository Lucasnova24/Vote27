import { useEffect, useState } from 'react'
import { enablePush, getPushStatus, syncPushSubscription, type PushStatus } from '../lib/push'
import { isStandalone } from '../lib/install'
import { markClosed, wasClosed, type PromptKind as Kind } from '../lib/dismissed'

interface Props {
  onShowInstall: () => void
}

// Bandeau en haut de l'accueil, un seul à la fois :
//  1. rappel d'ajouter l'appli à l'écran d'accueil (tuto d'après-inscription), si elle n'y est pas ;
//  2. sinon, invitation à activer les notifications.
export default function HomeBanner({ onShowInstall }: Props) {
  const [closed, setClosed] = useState<Record<Kind, boolean>>(() => ({ install: wasClosed('install'), push: wasClosed('push') }))
  const [status, setStatus] = useState<PushStatus | null>(null)
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

  const close = (k: Kind) => {
    markClosed(k)
    setClosed((c) => ({ ...c, [k]: true }))
  }

  const kind: Kind | null =
    !isStandalone() && !closed.install ? 'install'
    : status === 'off' && !closed.push && !isStandalone() ? 'push'
    : null
  if (!kind) return null

  const activate = async () => {
    setBusy(true)
    setFailed(false)
    try {
      setStatus(await enablePush())
    } catch (e) {
      console.error('[push]', e)
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  const install = kind === 'install'

  return (
    <section className="card stk" style={{ gap: 12, background: '#FFF4DC', borderColor: '#F0D9A0', position: 'relative', paddingRight: 52 }} aria-label={install ? "Ajouter l'appli à l'écran d'accueil" : 'Activer les notifications'}>
      <button
        type="button"
        onClick={() => close(kind)}
        aria-label="Fermer"
        style={{ position: 'absolute', top: 4, right: 4, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E4B00' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 26, lineHeight: 1 }} aria-hidden="true">{install ? '📲' : '🔔'}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: '#3D2A00' }}>
            {install ? "Ajoute l'appli à ton écran d'accueil" : 'Ne rate plus la question du jour'}
          </span>
          <span style={{ display: 'block', fontSize: 13.5, lineHeight: 1.5, color: '#6E4B00', marginTop: 3 }}>
            {install
              ? "Un geste pour l'ouvrir, en plein écran comme une vraie appli, et c'est indispensable pour recevoir les notifications sur iPhone."
              : "Reçois un rappel pour la question du jour, les événements de l'agenda et le vote de la semaine."}
          </span>
        </span>
      </div>

      <div>
        <button
          type="button"
          className="btn"
          disabled={busy}
          onClick={install ? () => { close('install'); onShowInstall() } : activate}
          style={{ background: '#171B3C', color: '#fff' }}
        >
          {install ? 'Voir comment faire' : busy ? 'Activation…' : 'Activer les notifications'}
        </button>
      </div>

      {failed && <div style={{ fontSize: 13, color: '#B0301A' }}>Impossible d'activer pour le moment. Réessaie dans un instant.</div>}
    </section>
  )
}
