import { useEffect, useState } from 'react'
import { disablePush, enablePush, getPushStatus, syncPushSubscription, type PushStatus } from '../lib/push'

// Carte « Notifications » du profil : active / désactive le push sur cet appareil.
export default function NotificationsCard() {
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

  if (status === null || status === 'unsupported') return null

  const run = async (fn: () => Promise<PushStatus>) => {
    setBusy(true)
    setFailed(false)
    try {
      setStatus(await fn())
    } catch (e) {
      console.error('[push]', e)
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  const on = status === 'on'

  return (
    <section className="card stk" style={{ gap: 10 }} aria-label="Notifications">
      <div className="row" style={{ gap: 12 }}>
        <span style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#DDF3E4' : '#EFEBE2', fontSize: 20 }} aria-hidden="true">🔔</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700 }}>Notifications</span>
          <span style={{ display: 'block', fontSize: 13, color: '#5C617B', marginTop: 2 }}>
            {on ? 'Activées sur cet appareil' : 'Question du jour, agenda, vote de la semaine'}
          </span>
        </span>
      </div>

      {status === 'needs-install' && (
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#454A66' }}>
          Sur iPhone, ajoute d'abord l'appli à ton écran d'accueil : touche <b>Partager</b> (le carré avec la flèche), puis <b>« Sur l'écran d'accueil »</b>. Ouvre-la ensuite depuis son icône pour activer les notifications.
        </div>
      )}

      {status === 'denied' && (
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#454A66' }}>
          Les notifications sont bloquées pour cette appli. Autorise-les dans les réglages de ton téléphone ou de ton navigateur, puis reviens ici.
        </div>
      )}

      {status === 'off' && (
        <button type="button" className="btn" disabled={busy} onClick={() => run(enablePush)} style={{ background: '#171B3C', color: '#fff' }}>
          {busy ? 'Activation…' : 'Activer les notifications'}
        </button>
      )}

      {on && (
        <button type="button" disabled={busy} onClick={() => run(disablePush)} style={{ alignSelf: 'flex-start', minHeight: 44, fontSize: 14, fontWeight: 700, color: '#454A66' }}>
          {busy ? '…' : 'Désactiver sur cet appareil'}
        </button>
      )}

      {failed && <div style={{ fontSize: 13, color: '#B0301A' }}>Impossible de modifier les notifications pour le moment. Réessaie dans un instant.</div>}
    </section>
  )
}
