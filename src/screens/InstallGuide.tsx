import { useEffect, useState } from 'react'
import { ACCENT } from '../data'
import Brand from '../components/Brand'
import { isIOS } from '../lib/install'

interface Props {
  isWeb: boolean
  onDone: () => void
}

type Platform = 'ios' | 'android'
type InstallPromptEvent = Event & { prompt: () => Promise<void> }

const STEPS: Record<Platform, { title: string; detail: string }[]> = {
  ios: [
    { title: 'Ouvre Mon Petit Vote dans Safari', detail: "L'installation ne fonctionne que depuis Safari (pas depuis Chrome, ni depuis le navigateur d'une autre appli)." },
    { title: 'Appuie sur le bouton Partager', detail: "C'est l'icône carrée avec une flèche vers le haut, en bas de l'écran (en haut sur iPad)." },
    { title: "Fais défiler et choisis « Sur l'écran d'accueil »", detail: "Si tu ne le vois pas, descends tout en bas de la liste d'options." },
    { title: 'Appuie sur « Ajouter »', detail: "Vérifie le nom de l'icône, puis valide en haut à droite." },
    { title: "Lance l'app depuis ton écran d'accueil", detail: "Elle s'ouvre en plein écran, comme une vraie application." },
  ],
  android: [
    { title: 'Ouvre Mon Petit Vote dans Chrome', detail: "Sur Samsung Internet ou Firefox, le menu est similaire." },
    { title: 'Appuie sur le menu ⋮', detail: "Trois points verticaux, en haut à droite de l'écran." },
    { title: "Choisis « Installer l'application »", detail: "Ou « Ajouter à l'écran d'accueil » selon ta version de Chrome." },
    { title: 'Confirme avec « Installer »', detail: "L'icône apparaît sur ton écran d'accueil et dans ta liste d'applications." },
    { title: "Lance l'app depuis ton écran d'accueil", detail: "Elle s'ouvre en plein écran, sans barre d'adresse." },
  ],
}

export default function InstallGuide({ isWeb, onDone }: Props) {
  const [platform, setPlatform] = useState<Platform>(isIOS() ? 'ios' : 'android')
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null)

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallPromptEvent) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const install = () => {
    if (!prompt) return
    prompt.prompt().finally(() => { setPrompt(null); onDone() })
  }

  const steps = STEPS[platform]
  return (
    <div style={{ minHeight: '100dvh', background: '#F6F4EE', color: '#14162B', fontFamily: "'Hanken Grotesk',system-ui,sans-serif", overflowY: 'auto', display: 'flex' }}>
      <div className="rise" style={{ margin: 'auto', width: '100%', maxWidth: 520, padding: isWeb ? '48px 20px' : '28px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Brand size={44} />
        <div className="stk" style={{ gap: 8 }}>
          <div className="eyebrow">Dernière étape</div>
          <h1 className="dsp" style={{ margin: 0, fontSize: isWeb ? 40 : 32, lineHeight: 1.04, fontWeight: 700 }}>Ton compte est créé 🎉</h1>
          <div style={{ fontSize: 15, lineHeight: 1.5, color: '#454A66' }}>
            Ajoute Mon Petit Vote à ton écran d'accueil : accès en un clic, plein écran, et tu ne rates plus ton vote du jour ni les débats. Ça prend 30 secondes.
          </div>
        </div>

        {prompt && (
          <button type="button" onClick={install} className="btn" style={{ background: ACCENT }}>Installer l'application</button>
        )}

        <div role="tablist" style={{ display: 'flex', gap: 6, background: '#EDE9DF', borderRadius: 14, padding: 4 }}>
          {([['ios', 'iPhone / iPad'], ['android', 'Android']] as const).map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={platform === k} onClick={() => setPlatform(k)}
              style={{ flex: 1, minHeight: 44, borderRadius: 11, fontWeight: 700, fontSize: 14, background: platform === k ? '#fff' : 'transparent', color: platform === k ? '#14162B' : '#5C617B', boxShadow: platform === k ? '0 1px 3px rgba(20,22,43,.12)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        <ol className="card" style={{ listStyle: 'none', margin: 0, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map((st, i) => (
            <li key={st.title} style={{ display: 'flex', gap: 12 }}>
              <span aria-hidden="true" style={{ flex: 'none', width: 28, height: 28, borderRadius: '50%', background: ACCENT, color: '#fff', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <div className="stk" style={{ gap: 2 }}>
                <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{st.title}</div>
                <div style={{ fontSize: 13, color: '#454A66', lineHeight: 1.45 }}>{st.detail}</div>
              </div>
            </li>
          ))}
        </ol>

        <button type="button" onClick={onDone} className="btn" style={{ background: prompt ? '#fff' : ACCENT, color: prompt ? '#14162B' : '#fff', border: prompt ? '1.5px solid #DDD7C9' : undefined }}>
          C'est fait, continuer
        </button>
        <button type="button" onClick={onDone} style={{ minHeight: 44, fontSize: 14, fontWeight: 700, color: '#5C617B', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Plus tard
        </button>
      </div>
    </div>
  )
}
