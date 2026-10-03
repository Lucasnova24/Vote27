import { Suspense, lazy } from 'react'

const Sheep3D = lazy(() => import('./Sheep3D'))

// Static sheep shown while the 3D scene (three.js + model) is still loading,
// or if WebGL is unavailable.
function SheepFallback() {
  return <img src="/mouton.png" alt="" width={180} height={180} draggable={false} className="mpv-hop" />
}

export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Chargement"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', background: '#F5F0E6', gap: 8, padding: 24,
      }}
    >
      <style>{`
        @keyframes mpv-hop { 0%,100% { transform: translateY(0) scale(1.04,.96) } 45% { transform: translateY(-22px) scale(.98,1.03) } }
        @keyframes mpv-slide { 0% { transform: translateX(-100%) } 100% { transform: translateX(350%) } }
        @keyframes mpv-dots { 0% { content: '' } 25% { content: '.' } 50% { content: '..' } 75%,100% { content: '...' } }
        .mpv-hop { animation: mpv-hop 1s ease-in-out infinite }
        .mpv-dots::after { content: ''; animation: mpv-dots 1.2s steps(1) infinite }
        @media (prefers-reduced-motion: reduce) { .mpv-hop, .mpv-bar > i, .mpv-dots::after { animation: none !important } }
      `}</style>
      <div style={{ width: 'min(70vw, 280px)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Suspense fallback={<SheepFallback />}>
          <Sheep3D fallback={<SheepFallback />} />
        </Suspense>
      </div>
      <div className="dsp" style={{ fontWeight: 800, fontSize: 24, lineHeight: 1.05, textAlign: 'center', color: '#14162B' }}>
        Mon Petit Vote <span style={{ color: '#3B4FD8' }}>2027</span>
      </div>
      <div
        className="mpv-bar"
        style={{ width: 150, height: 6, borderRadius: 3, background: '#E4DDCB', overflow: 'hidden', marginTop: 10 }}
      >
        <i
          style={{
            display: 'block', width: '40%', height: '100%', borderRadius: 3,
            background: 'linear-gradient(90deg, #1E2F8F 0 33%, #F5F0E6 33% 66%, #D2452C 66%)',
            boxShadow: 'inset 0 0 0 1px rgba(20,22,43,.12)',
            animation: 'mpv-slide 1.4s ease-in-out infinite',
          }}
        />
      </div>
      <div className="mpv-dots" style={{ fontSize: 13, color: '#5C617B', marginTop: 4 }}>Chargement</div>
    </div>
  )
}
