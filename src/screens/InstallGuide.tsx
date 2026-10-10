import { useEffect, useState, type ReactNode } from 'react'
import { ACCENT } from '../data'
import Brand from '../components/Brand'
import { isIOS } from '../lib/install'

interface Props {
  isWeb: boolean
  onDone: () => void
}

type Platform = 'ios' | 'android'
type InstallPromptEvent = Event & { prompt: () => Promise<void> }

type IconKey = 'browser' | 'share' | 'addHome' | 'confirm' | 'app' | 'menu' | 'install'

const ICONS: Record<IconKey, ReactNode> = {
  browser: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></>,
  share: <><path d="M12 15V3M8 7l4-4 4 4" /><path d="M7 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1" /></>,
  addHome: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>,
  confirm: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  app: <><rect x="6" y="2.5" width="12" height="19" rx="3" /><rect x="9" y="6" width="6" height="6" rx="1.5" /></>,
  menu: <><circle cx="12" cy="5" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="19" r="1.6" fill="currentColor" /></>,
  install: <><path d="M12 4v10M8 10l4 4 4-4" /><path d="M5 19h14" /></>,
}

function StepIcon({ name }: { name: IconKey }) {
  return (
    <span aria-hidden="true" style={{ flex: 'none', width: 44, height: 44, borderRadius: 12, background: '#F1F3FF', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{ICONS[name]}</svg>
    </span>
  )
}

const STEPS: Record<Platform, { title: string; detail: string; icon: IconKey }[]> = {
  ios: [
    { icon: 'browser', title: 'Ouvre Mon Petit Vote dans ton navigateur', detail: "Safari, Chrome, Firefox… ça fonctionne avec ton navigateur habituel." },
    { icon: 'share', title: 'Appuie sur le bouton Partager', detail: "C'est l'icône carrée avec une flèche vers le haut, en bas de l'écran (en haut sur iPad). Dans Chrome, elle est à droite de la barre d'adresse." },
    { icon: 'addHome', title: "Fais défiler et choisis « Sur l'écran d'accueil »", detail: "Si tu ne le vois pas, descends tout en bas de la liste d'options." },
    { icon: 'confirm', title: 'Appuie sur « Ajouter »', detail: "Vérifie le nom de l'icône, puis valide en haut à droite." },
    { icon: 'app', title: "Lance l'app depuis ton écran d'accueil", detail: "Elle s'ouvre en plein écran, comme une vraie application." },
  ],
  android: [
    { icon: 'browser', title: 'Ouvre Mon Petit Vote dans ton navigateur', detail: "Chrome, Samsung Internet, Firefox… le menu est similaire." },
    { icon: 'menu', title: 'Appuie sur le menu ⋮', detail: "Trois points verticaux, en haut à droite de l'écran." },
    { icon: 'install', title: "Choisis « Installer l'application »", detail: "Ou « Ajouter à l'écran d'accueil » selon ta version du navigateur." },
    { icon: 'confirm', title: 'Confirme avec « Installer »', detail: "L'icône apparaît sur ton écran d'accueil et dans ta liste d'applications." },
    { icon: 'app', title: "Lance l'app depuis ton écran d'accueil", detail: "Elle s'ouvre en plein écran, sans barre d'adresse." },
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
              style={{ flex: 1, minHeight: 44, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 700, fontSize: 14, background: platform === k ? '#fff' : 'transparent', color: platform === k ? '#14162B' : '#5C617B', boxShadow: platform === k ? '0 1px 3px rgba(20,22,43,.12)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        <ol className="card" style={{ listStyle: 'none', margin: 0, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map((st, i) => (
            <li key={st.title} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span aria-hidden="true" style={{ flex: 'none', width: 28, height: 28, borderRadius: '50%', background: ACCENT, color: '#fff', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <StepIcon name={st.icon} />
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
