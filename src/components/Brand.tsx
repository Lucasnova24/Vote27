import { useId } from 'react'

interface LogoProps {
  size?: number
}

// Mon Petit Vote 2027 mark: the tricolore sheep (blue / white / red fleece)
// on a paper tile, so its dark outline stays readable on any background.
export function LogoMouton({ size = 40 }: LogoProps) {
  const cid = 'mouton-' + useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Mon Petit Vote 2027">
      <rect width="48" height="48" rx="12" fill="#F5F0E6" />
      <svg x="2" y="9" width="44" height="30" viewBox="30 56 335 210">
<g>
<rect x="128" y="180" width="18" height="78" rx="9" fill="#16192B" /><rect x="172" y="180" width="18" height="78" rx="9" fill="#16192B" /><rect x="236" y="180" width="18" height="78" rx="9" fill="#16192B" /><rect x="280" y="180" width="18" height="78" rx="9" fill="#16192B" />
<circle cx="330" cy="118" r="17" fill="#C8401F" stroke="#16192B" strokeWidth="7" />
<g fill="#16192B" stroke="#16192B" strokeWidth="14" strokeLinejoin="round"><ellipse cx="205" cy="138" rx="118" ry="64" /><circle cx="323.0" cy="138.0" r="27" /><circle cx="315.9" cy="159.9" r="22" /><circle cx="295.4" cy="179.1" r="22" /><circle cx="264.0" cy="193.4" r="22" /><circle cx="225.5" cy="201.0" r="22" /><circle cx="184.5" cy="201.0" r="22" /><circle cx="146.0" cy="193.4" r="22" /><circle cx="114.6" cy="179.1" r="22" /><circle cx="94.1" cy="159.9" r="22" /><circle cx="87.0" cy="138.0" r="27" /><circle cx="94.1" cy="116.1" r="27" /><circle cx="114.6" cy="96.9" r="27" /><circle cx="146.0" cy="82.6" r="27" /><circle cx="184.5" cy="75.0" r="27" /><circle cx="225.5" cy="75.0" r="27" /><circle cx="264.0" cy="82.6" r="27" /><circle cx="295.4" cy="96.9" r="27" /><circle cx="315.9" cy="116.1" r="27" /></g>
<clipPath id={cid}><ellipse cx="205" cy="138" rx="118" ry="64" /><circle cx="323.0" cy="138.0" r="27" /><circle cx="315.9" cy="159.9" r="22" /><circle cx="295.4" cy="179.1" r="22" /><circle cx="264.0" cy="193.4" r="22" /><circle cx="225.5" cy="201.0" r="22" /><circle cx="184.5" cy="201.0" r="22" /><circle cx="146.0" cy="193.4" r="22" /><circle cx="114.6" cy="179.1" r="22" /><circle cx="94.1" cy="159.9" r="22" /><circle cx="87.0" cy="138.0" r="27" /><circle cx="94.1" cy="116.1" r="27" /><circle cx="114.6" cy="96.9" r="27" /><circle cx="146.0" cy="82.6" r="27" /><circle cx="184.5" cy="75.0" r="27" /><circle cx="225.5" cy="75.0" r="27" /><circle cx="264.0" cy="82.6" r="27" /><circle cx="295.4" cy="96.9" r="27" /><circle cx="315.9" cy="116.1" r="27" /></clipPath>
<g clipPath={`url(#${cid})`}><rect x="50" y="40" width="115" height="220" fill="#1E3470" /><rect x="165" y="40" width="80" height="220" fill="#FFFFFF" /><rect x="245" y="40" width="160" height="220" fill="#C8401F" /></g>
<ellipse cx="116" cy="96" rx="30" ry="11" transform="rotate(-12 116 96)" fill="#16192B" />
<path d="M92 72 C58 70 36 100 38 134 C40 160 56 176 76 176 C98 176 112 156 112 128 C112 100 110 76 92 72 Z" fill="#16192B" />
<ellipse cx="40" cy="104" rx="28" ry="10" transform="rotate(14 40 104)" fill="#16192B" />
<circle cx="70" cy="68" r="15" fill="#FFFFFF" stroke="#16192B" strokeWidth="5" />
<circle cx="92" cy="66" r="13" fill="#FFFFFF" stroke="#16192B" strokeWidth="5" />
<circle cx="54" cy="78" r="11" fill="#FFFFFF" stroke="#16192B" strokeWidth="5" />
<path d="M58 118 q7 -7 14 0" stroke="#FFFFFF" strokeWidth="4.5" fill="none" strokeLinecap="round" />
<path d="M86 116 q7 -7 14 0" stroke="#FFFFFF" strokeWidth="4.5" fill="none" strokeLinecap="round" />
<ellipse cx="58" cy="140" rx="7" ry="5" fill="#E6A89A" />
<path d="M66 156 q10 8 22 0" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
</g>
      </svg>
    </svg>
  )
}

interface BrandProps {
  size?: number
  dark?: boolean
  onClick?: () => void
}

// Logo + name. `dark` is for use on the navy sidebar/panel.
export default function Brand({ size = 40, dark = false, onClick }: BrandProps) {
  const content = (
    <>
      <LogoMouton size={size} />
      <span className="dsp" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, fontWeight: 800 }}>
        <span style={{ fontSize: Math.round(size * 0.46), whiteSpace: 'nowrap' }}>Mon Petit Vote</span>
        <span style={{ fontSize: Math.round(size * 0.46), marginTop: 3, color: dark ? '#B8C0F5' : '#3B4FD8' }}>2027</span>
      </span>
    </>
  )
  if (!onClick) return <span className="row" style={{ gap: 10 }}>{content}</span>
  return (
    <button type="button" onClick={onClick} className="row" style={{ gap: 10, textAlign: 'left', minHeight: 44 }} aria-label="Mon Petit Vote 2027, retour à l'accueil">
      {content}
    </button>
  )
}
