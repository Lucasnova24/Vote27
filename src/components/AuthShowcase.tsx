import { useEffect, useRef, useState, type ReactNode } from 'react'
import Brand from './Brand'

// Panneau gauche de l'écran de connexion (web) : un carrousel qui accroche
// avec un message fort puis explique l'appli avec de mini-écrans illustrés.
// Les écrans sont dessinés en JSX (aucune image) : exemples fictifs, sans
// nom de candidat.

const INK = '#14162B'
const MUTED = '#5C617B'
const LINE = '#E7E2D6'

function Phone({ children, tilt = -3 }: { children: ReactNode; tilt?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 268,
        borderRadius: 34,
        background: '#F6F4EE',
        color: INK,
        padding: '14px 14px 16px',
        border: '7px solid #0C0E24',
        boxShadow: '0 40px 70px -28px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.08)',
        transform: `rotate(${tilt}deg)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        textAlign: 'left',
      }}
    >
      <div style={{ width: 54, height: 5, borderRadius: 9, background: '#D9D3C4', alignSelf: 'center' }} />
      {children}
    </div>
  )
}

function Bubble({ children, color, bg, style }: { children: ReactNode; color: string; bg: string; style?: React.CSSProperties }) {
  return (
    <div className="dsp" style={{ position: 'absolute', background: bg, color, fontWeight: 700, fontSize: 13, padding: '8px 13px', borderRadius: 14, boxShadow: '0 12px 24px -12px rgba(0,0,0,.55)', ...style }}>
      {children}
    </div>
  )
}

/* ——— Slide 1 : le slogan ——— */
function SlideMouton() {
  return (
    <div style={{ position: 'relative', width: 300, height: 300, display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 14, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #3A4296 0%, #232A63 60%, #171B3C 100%)' }} />
      <img src="/mouton.png" alt="" width={230} height={230} draggable={false} style={{ position: 'relative', filter: 'drop-shadow(0 22px 22px rgba(0,0,0,.4))' }} />
      <Bubble bg="#fff" color="#C8341C" style={{ top: 18, right: -6, transform: 'rotate(5deg)' }}>Bêêê… 🙄</Bubble>
      <Bubble bg="#F0A03C" color="#3B2400" style={{ bottom: 26, left: -16, transform: 'rotate(-5deg)' }}>Je suis mon avis</Bubble>
    </div>
  )
}

/* ——— Slide 2 : Boussole / affinités ——— */
function SlideAffinites() {
  const rows = [
    { l: 'A', c: '#3B4FD8', v: 86 },
    { l: 'B', c: '#0E7A6B', v: 71 },
    { l: 'C', c: '#C2385A', v: 54 },
    { l: 'D', c: '#A85400', v: 33 },
  ]
  return (
    <Phone tilt={3}>
      <div className="eyebrow">Ma boussole · exemple</div>
      <div className="dsp" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.15 }}>« Il faut réduire le temps de travail à 32 h par semaine. »</div>
      <div style={{ display: 'flex', gap: 4 }}>
        {['#C8341C', '#E39A8F', '#B4B0A3', '#6DB287', '#1F7A3E'].map((c, i) => (
          <div key={c} style={{ flex: 1, height: 28, borderRadius: 9, background: c, opacity: i === 3 ? 1 : 0.35, outline: i === 3 ? `2.5px solid ${INK}` : 'none', outlineOffset: 2 }} />
        ))}
      </div>
      <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: MUTED }}>TES AFFINITÉS</div>
        {rows.map((r) => (
          <div key={r.l} className="row" style={{ gap: 8 }}>
            <span style={{ width: 24, height: 24, borderRadius: 8, background: r.c, color: '#fff', fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{r.l}</span>
            <div className="bar" style={{ flex: 1, height: 8 }}><i style={{ width: `${r.v}%`, background: r.c }} /></div>
            <span className="num" style={{ fontSize: 12, fontWeight: 800, width: 32, textAlign: 'right' }}>{r.v}%</span>
          </div>
        ))}
      </div>
    </Phone>
  )
}

/* ——— Slide 3 : Isoloir (les votes) ——— */
function SlideIsoloir() {
  return (
    <Phone tilt={-3}>
      <div className="eyebrow">Isoloir · exemple</div>
      <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="tag" style={{ alignSelf: 'flex-start', background: '#E3E7FF', color: '#1F2A8A', fontSize: 11 }}>Vote du jour</span>
        <div className="dsp" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.15 }}>Faut-il rendre le vote obligatoire ?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, textAlign: 'center', borderRadius: 12, padding: '9px 0', fontSize: 13, fontWeight: 800, background: '#1F7A3E', color: '#fff' }}>Oui ✓</div>
          <div style={{ flex: 1, textAlign: 'center', borderRadius: 12, padding: '9px 0', fontSize: 13, fontWeight: 800, background: '#EFEBE2', color: MUTED }}>Non</div>
        </div>
      </div>
      <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="tag" style={{ alignSelf: 'flex-start', background: '#FFEBC6', color: '#6E3A00', fontSize: 11 }}>1er tour · vote de la semaine</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#3B4FD8', '#0E7A6B', '#A85400', '#6B45D9', '#C2385A'].map((c, i) => (
            <span key={c} style={{ width: 30, height: 30, borderRadius: '50%', background: c, outline: i === 1 ? `2.5px solid ${INK}` : 'none', outlineOffset: 2, opacity: i === 1 ? 1 : 0.5 }} />
          ))}
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: MUTED, fontWeight: 600 }}>Retrouve tout l'historique de tes votes</div>
    </Phone>
  )
}

/* ——— Slide 4 : Programmes ——— */
function SlideProgrammes() {
  const themes = [
    { n: 'Économie', c: '#A85400', s: '#FFEBC6', on: true },
    { n: 'Écologie', c: '#1F7A3E', s: '#DDF3E3' },
    { n: 'Europe', c: '#0B6BB8', s: '#D8EBFB' },
  ]
  return (
    <Phone tilt={-3}>
      <div className="eyebrow">Programmes · exemple</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {themes.map((t) => (
          <span key={t.n} className="tag" style={{ background: t.on ? t.c : t.s, color: t.on ? '#fff' : t.c }}>{t.n}</span>
        ))}
      </div>
      {['Candidat A', 'Candidat B'].map((n, i) => (
        <div key={n} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="row" style={{ gap: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: i ? '#0E7A6B' : '#3B4FD8', color: '#fff', fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{n.slice(-1)}</span>
            <b style={{ fontSize: 13.5 }}>{n}</b>
          </div>
          <div style={{ height: 7, borderRadius: 9, background: '#EFEBE2', width: '92%' }} />
          <div style={{ height: 7, borderRadius: 9, background: '#EFEBE2', width: '68%' }} />
          <span className="tag" style={{ alignSelf: 'flex-start', background: '#EFE0FA', color: '#4E2766', fontSize: 11 }}>🔗 Source vérifiable</span>
        </div>
      ))}
    </Phone>
  )
}

/* ——— Slide 4 : Quiz ——— */
function SlideQuiz() {
  const choices = [
    { t: 'Le Sénat', ok: false },
    { t: 'Le Conseil constitutionnel', ok: true },
    { t: 'La Cour des comptes', ok: false },
  ]
  return (
    <Phone tilt={3}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="eyebrow">Quiz du jour · exemple</span>
        <span className="tag" style={{ background: '#FFEBC6', color: '#6E3A00' }}>🔥 7 jours</span>
      </div>
      <div className="dsp" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.15 }}>Qui valide la régularité de l'élection présidentielle ?</div>
      {choices.map((c) => (
        <div key={c.t} style={{ border: `1.5px solid ${c.ok ? '#1F7A3E' : '#DDD7C9'}`, background: c.ok ? '#DDF3E3' : '#fff', color: c.ok ? '#14532D' : INK, borderRadius: 14, padding: '10px 12px', fontSize: 13, fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
          {c.t}{c.ok && <span>✓</span>}
        </div>
      ))}
      <div style={{ fontSize: 11.5, color: MUTED, fontWeight: 600 }}>+10 pts · progresse dans les ligues</div>
    </Phone>
  )
}

/* ——— Slide 5 : Agenda ——— */
function SlideAgenda() {
  const ev = [
    { c: 'Débat', soft: '#FFDFD8', ink: '#8A1F0E', t: 'Grand débat télévisé', d: 'Jeu. 20:45' },
    { c: 'Meeting', soft: '#E3E7FF', ink: '#1F2A8A', t: 'Meeting en région', d: 'Sam. 15:00' },
    { c: 'Interview', soft: '#FFEBC6', ink: '#6E3A00', t: 'Interview matinale', d: 'Lun. 08:15' },
  ]
  return (
    <Phone tilt={-3}>
      <div className="eyebrow">Agenda · exemple</div>
      {ev.map((e) => (
        <div key={e.t} style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="tag" style={{ background: e.soft, color: e.ink, fontSize: 11 }}>{e.c}</span>
            <span className="num" style={{ fontSize: 11.5, fontWeight: 700, color: MUTED }}>{e.d}</span>
          </div>
          <b style={{ fontSize: 13.5 }}>{e.t}</b>
        </div>
      ))}
      <div style={{ background: '#171B3C', color: '#fff', borderRadius: 14, padding: '9px 12px', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>🔔 Me prévenir avant le direct</div>
    </Phone>
  )
}

const SLIDES: { key: string; kicker: string; title: string; text: string; visual: ReactNode }[] = [
  {
    key: 'mouton',
    kicker: 'Mon Petit Vote 2027',
    title: 'Ne votez pas comme des moutons.',
    text: 'Avant le 18 avril 2027, forge-toi ta propre opinion : programmes, sources, quiz et débats, au même endroit.',
    visual: <SlideMouton />,
  },
  {
    key: 'boussole',
    kicker: '1 · La boussole',
    title: 'Découvre qui pense vraiment comme toi.',
    text: 'Réponds à des affirmations, d\'accord ou pas d\'accord. L\'appli calcule tes affinités avec chaque candidat, thème par thème.',
    visual: <SlideAffinites />,
  },
  {
    key: 'isoloir',
    kicker: '2 · L\'isoloir',
    title: 'Vote, même avant l\'élection.',
    text: 'Vote du jour, vote après chaque débat, pronostic du 1er tour chaque semaine : donne ton avis et suis l\'évolution de tes choix.',
    visual: <SlideIsoloir />,
  },
  {
    key: 'programmes',
    kicker: '3 · Programmes',
    title: 'Compare les programmes, sources à l\'appui.',
    text: 'Six thèmes, tous les candidats déclarés, et un lien vérifiable pour chaque position. Zéro intox.',
    visual: <SlideProgrammes />,
  },
  {
    key: 'quiz',
    kicker: '4 · Le quiz',
    title: 'Teste-toi, un peu chaque jour.',
    text: 'Un quiz quotidien pour mieux comprendre les institutions et les enjeux. Gagne des points, des badges et grimpe dans les ligues.',
    visual: <SlideQuiz />,
  },
  {
    key: 'agenda',
    kicker: '5 · L\'agenda',
    title: 'Ne rate aucun débat.',
    text: 'Débats, meetings, interviews : suis tout le calendrier de la campagne et reçois un rappel avant le direct.',
    visual: <SlideAgenda />,
  },
]

const DELAY = 6500

const arrowStyle: React.CSSProperties = {
  width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center',
  background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)', color: '#fff',
}

export default function AuthShowcase() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length)
  const next = () => go(i + 1)
  const prev = () => go(i - 1)

  // Le minuteur suit la barre : temps restant conservé pendant la pause.
  const remaining = useRef(DELAY)
  const lastSlide = useRef(i)
  useEffect(() => {
    if (paused) return
    if (lastSlide.current !== i) { lastSlide.current = i; remaining.current = DELAY }
    const start = Date.now()
    const id = window.setTimeout(() => go(i + 1), remaining.current)
    return () => {
      window.clearTimeout(id)
      remaining.current = Math.max(0, remaining.current - (Date.now() - start))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused])

  const slide = SLIDES[i]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: 'relative', flex: 1, minWidth: 0, background: '#171B3C', color: '#fff', padding: '48px 56px 40px', display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden' }}
    >
      {/* halos décoratifs */}
      <div aria-hidden="true" style={{ position: 'absolute', width: 520, height: 520, right: -200, top: -160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,109,240,.45), transparent 65%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', width: 460, height: 460, left: -180, bottom: -200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,124,151,.28), transparent 65%)' }} />

      <div style={{ position: 'relative' }}><Brand size={44} dark /></div>

      <div key={slide.key} className="rise" style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div className="stk" style={{ gap: 16, flex: '1 1 300px', maxWidth: 460 }}>
          <span className="eyebrow" style={{ color: '#B8C0F5' }}>{slide.kicker}</span>
          <div className="dsp" style={{ fontSize: 46, lineHeight: 1.03, fontWeight: 800 }}>{slide.title}</div>
          <div style={{ fontSize: 16, lineHeight: 1.55, color: '#C9CEEE' }}>{slide.text}</div>
        </div>
        <div style={{ flex: '0 0 auto', display: 'grid', placeItems: 'center' }}>{slide.visual}</div>
      </div>

      <div style={{ position: 'relative' }} className="stk">
        <style>{`@keyframes authFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
        <div className="row" style={{ gap: 12 }}>
          <button type="button" onClick={prev} aria-label="Explication précédente" className="press" style={arrowStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <div role="tablist" aria-label="Découvrir l'application" className="row" style={{ gap: 6, flex: 1, maxWidth: 360 }}>
            {SLIDES.map((sl, n) => (
              <button
                key={sl.key}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={sl.kicker}
                onClick={() => go(n)}
                style={{ flex: 1, height: 24, display: 'flex', alignItems: 'center', padding: 0 }}
              >
                <span style={{ display: 'block', width: '100%', height: 5, borderRadius: 99, background: 'rgba(255,255,255,.25)', overflow: 'hidden' }}>
                  <span
                    key={n === i ? 'on-' + i : 'off'}
                    style={{
                      display: 'block', height: '100%', borderRadius: 99, background: '#fff', transformOrigin: 'left',
                      transform: n < i ? 'scaleX(1)' : 'scaleX(0)',
                      ...(n === i ? { animation: `authFill ${DELAY}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' } : {}),
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Explication suivante" className="press" style={arrowStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.55, color: '#A7ADD3', maxWidth: 520, marginTop: 10 }}>
          Mon Petit Vote 2027 est une application civique indépendante et non officielle. Les écrans ci-dessus sont des exemples illustratifs ; les votes, quiz et pronostics n'ont aucune valeur de sondage officiel.
        </div>
      </div>
    </div>
  )
}
