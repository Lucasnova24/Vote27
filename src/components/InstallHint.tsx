import { useEffect, useState } from 'react'
import { ACCENT } from '../data'
import { dismissInstallHint, isIOS, isStandalone, shouldShowInstallHint } from '../lib/installHint'

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

// Mini-notif affichée une seule fois après la création du compte (mobile uniquement).
export default function InstallHint() {
  const [open, setOpen] = useState(() => shouldShowInstallHint() && !isStandalone())
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null)
  const ios = isIOS()

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallPromptEvent) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!open) return null

  const close = () => { dismissInstallHint(); setOpen(false) }
  const install = async () => { await prompt?.prompt(); close() }

  return (
    <div role="dialog" aria-label="Ajouter l'appli à l'écran d'accueil" className="rise" style={{ position: 'fixed', left: 12, right: 12, bottom: 84, zIndex: 50, background: '#fff', border: '1px solid #E7E2D6', borderRadius: 18, padding: 16, boxShadow: '0 12px 40px rgba(20,22,43,.22)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="row" style={{ gap: 12, alignItems: 'center' }}>
        <img src="/icon-192.png" alt="" width={44} height={44} style={{ borderRadius: 11 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="dsp" style={{ fontSize: 17, fontWeight: 700 }}>Ajoute Petit Vote à ton écran d'accueil</div>
          <div style={{ fontSize: 13, color: '#454A66', lineHeight: 1.4 }}>Pour y accéder en un clic, comme une vraie appli.</div>
        </div>
      </div>
      <div style={{ fontSize: 14, color: '#14162B', lineHeight: 1.5, background: '#F6F4EE', borderRadius: 12, padding: '10px 12px' }}>
        {ios ? (
          <>1. Touche <b>Partager</b> <span aria-hidden="true">⎙</span> dans la barre de Safari<br />2. Choisis <b>« Sur l'écran d'accueil »</b></>
        ) : prompt ? (
          <>Touche le bouton ci-dessous pour l'installer.</>
        ) : (
          <>1. Ouvre le menu <b>⋮</b> du navigateur<br />2. Choisis <b>« Ajouter à l'écran d'accueil »</b></>
        )}
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button type="button" onClick={close} style={{ flex: 1, minHeight: 44, fontWeight: 700, color: '#454A66' }}>Plus tard</button>
        {prompt && !ios
          ? <button type="button" onClick={install} className="btn" style={{ flex: 1, background: ACCENT }}>Installer</button>
          : <button type="button" onClick={close} className="btn" style={{ flex: 1, background: ACCENT }}>Compris</button>}
      </div>
    </div>
  )
}
